# Bug Report: WASM files incorrectly bundled into server assets with TanStack Start + Cloudflare Workers

## Title

TanStack Start (SSR) copies Web Worker WASM binaries into `dist/server/assets`, inflating the worker bundle with ~9 MB of dead code — wasm should only ship in the client build

## Environment

- **Framework**: [TanStack Start](https://tanstack.com/start) `@tanstack/react-start` `1.168.17`
- **Router**: `@tanstack/react-router` `1.162.2`
- **Build tool**: Vite `8.2.0` (Rolldown-based)
- **Deploy target**: Cloudflare Workers via `@cloudflare/vite-plugin` `1.50.0` + `wrangler` `4.118.0`
- **Runtime**: Bun `1.x` (irrelevant to the bug; reproduces with `bun run build`)
- **Deploy config**: `wrangler.jsonc` with `"main": "@tanstack/react-start/server-entry"` and static assets served from `dist/client`

## Summary

When building a TanStack Start app that uses a Web Worker which imports `@jsquash/*` image codecs (which ship Emscripten-compiled `.wasm` files), the **SSR/server build also emits all the WASM binaries plus the full worker chunk into `dist/server/assets/`**.

The worker is created **client-side only** via `new Worker(new URL("./image.worker.ts", import.meta.url), { type: "module" })`. It never runs on the server. Yet `vite build`:

1. Emits `dist/client/assets/*.wasm` (correct — needed by the browser worker)
2. **Also emits the identical `*.wasm` files into `dist/server/assets/`** (incorrect — never used server-side)
3. Also emits a fully inlined `image.worker-*.js` chunk into `dist/server/assets/` (also never imported by the server bundle)

## Impact

- The Cloudflare Worker bundle (`dist/server`) grows by **~9.11 MB** of WASM files (9 files, 10.33 MB of total server assets) that are **never referenced** by the server entry.
- `dist/server/index.js` contains **zero** references to `.wasm`; the `image.worker-*.js` chunk is not imported by any other server chunk. It is pure dead weight that gets uploaded on every deploy.
- This bloats deploy time/size and hits [Cloudflare Worker bundle size limits](https://developers.cloudflare.com/workers/platform/limits/) (the 3 MB compressed / 10 MB uncompressed script limit) even though the app would otherwise be well under budget.

## Expected behavior

WASM assets reachable **only** from a client-side Web Worker should be emitted exclusively into the **client** build (`dist/client/assets/`). The server build should tree-shake / exclude the worker graph entirely, leaving `dist/server` free of `.wasm` and worker chunks.

## Actual behavior

```
dist/server/assets/avif_dec-B7YOdlSS.wasm       1,143.5 KB
dist/server/assets/avif_enc-Co4TcJko.wasm       3,404.2 KB
dist/server/assets/avif_enc_mt-DFoVXd45.wasm    3,451.8 KB
dist/server/assets/mozjpeg_dec-muSO2n8T.wasm      162.6 KB
dist/server/assets/mozjpeg_enc-DO-zoExo.wasm      245.6 KB
dist/server/assets/squoosh_png_bg-DAY7U9NW.wasm   176.8 KB
dist/server/assets/webp_dec-C990n7mh.wasm         134.7 KB
dist/server/assets/webp_enc-BpZvKflB.wasm         274.7 KB
dist/server/assets/webp_enc_simd-CFvKQ_80.wasm    337.5 KB
dist/server/assets/image.worker-DDVYh5u9.js       174.5 KB  (inlined @jsquash glue)
```

## Repro

Minimal reproduction sketch:

```ts
// src/shared/services/image/image.worker.ts
import { encode as encodeWebp } from "@jsquash/webp";
import * as Comlink from "comlink";
const api = { async convert(buf: ArrayBuffer) { return encodeWebp({ data: new Uint8Array(buf), width: 1, height: 1 }, { quality: 80 }); } };
Comlink.expose(api);

// src/shared/services/image/image.client.ts
import type { ImageWorkerApi } from "./image.worker";
import * as Comlink from "comlink";
export function getApi() {
  return Comlink.wrap<ImageWorkerApi>(new Worker(new URL("./image.worker.ts", import.meta.url), { type: "module" }));
}
```

Any route (universal component) that imports `image.client.ts` triggers the leak.

Steps:

```bash
bun run build
ls dist/client/assets/*.wasm  # expected
ls dist/server/assets/*.wasm  # BUG: identical files present
```

## Analysis / root-cause hypothesis

The `new URL(..., import.meta.url)` worker pattern is resolved by Vite into **every environment's** module graph (both the `client` and `ssr` environments). TanStack Start's SSR build therefore bundles `image.worker.ts` and its `@jsquash/*` imports, emitting the worker chunk + WASM assets into `dist/server/assets/`.

Notably, `clawpdf` (which also ships a large `pdfium.esm.wasm`) does **not** leak — because it is imported via the client-only `clawpdf/browser` entry, so the server never pulls its worker/wasm graph. The leak is specific to code that is reachable from the SSR graph even though it only ever executes in a browser worker.

### Control: identical app on Nitro produces no server-side WASM leak

As a control, the **same app** (same routes, same `image.worker.ts`, same `@jsquash/*` imports) built with **Nitro** (via `@tanstack/react-start`'s Nitro adapter / `nitropack`) does **not** leak WASM into the server output:

- Nitro's client build emits `*.wasm` into client assets only.
- The Nitro server build (`node_modules/.nitro` / output) contains **no** `*.wasm` files and no inlined worker chunk — the server bundle tree-shakes the client-only worker graph.

This rules out Vite's `new URL()` worker handling itself as the cause. Since both stacks use the same Vite worker resolution, the difference is in how the **framework's SSR environment** treats worker-only code: TanStack Start eagerly resolves the worker target into the SSR graph, while Nitro excludes it.

| Build | `dist/server` / Nitro output contains WASM? |
|---|---|
| TanStack Start + Cloudflare (`vite build`) | ✅ Leaks all 9 wasm files (9.11 MB) |
| Same app + Nitro | ❌ No wasm in server output |
| Same app + plain Vite client build | ❌ wasm only in client assets |

Workarounds attempted / considered:
- `build.assetsInlineLimit` / `worker.format` — no effect on this leak.
- Moving the worker URL into a `.client`-only module — the SSR build still resolves the `new URL()` target because the worker file itself is imported for its types (`import type { ImageWorkerApi }`) — but even a runtime import leaks via the static `new URL()` resolution.

## Expected fix

TanStack Start's SSR build should not emit assets/worker chunks that are only referenced from within the client bundle (or at minimum, dead worker chunks should be tree-shaken when nothing in the server graph imports them).

## References

- Related Vite behavior: `new URL(..., import.meta.url)` worker assets are emitted per-build-environment: https://vitejs.dev/guide/features.html#web-workers
- Cloudflare Worker limits: https://developers.cloudflare.com/workers/platform/limits/
