# JavaScript API Reference — PDF Oxide

PDF Oxide provides WebAssembly bindings for JavaScript and TypeScript. The npm package `pdf-oxide-wasm` works in Node.js, browsers, bundlers, Deno, and Cloudflare Workers.

```bash
npm install pdf-oxide-wasm
```

## Multi-target packaging (v0.3.38)

`pdf-oxide-wasm` now ships three builds side by side with `package.json` conditional exports. Pick the subpath that matches your runtime:

| Subpath | Target |
| --- | --- |
| `pdf-oxide-wasm/nodejs` | Node.js (CommonJS + ESM) |
| `pdf-oxide-wasm/bundler` | Vite, webpack, Rollup, esbuild, Bun |
| `pdf-oxide-wasm/web` | Browsers, Deno, Cloudflare Workers |

```js
// Node.js
import { WasmPdfDocument } from "pdf-oxide-wasm/nodejs";

// Vite / webpack / Rollup
import init, { WasmPdfDocument } from "pdf-oxide-wasm/bundler";
await init();

// Browsers / Deno / Workers
import init, { WasmPdfDocument } from "pdf-oxide-wasm/web";
await init();
```

## WasmPdfDocument

The primary class for opening, extracting, editing, and saving PDFs.

### Constructor

```js
new WasmPdfDocument(data, password?)
```

Load a PDF document from raw bytes.

| Parameter | Type | Description |
| --- | --- | --- |
| `data` | `Uint8Array` | The PDF file contents |
| `password` | `string | undefined` | Optional password for encrypted PDFs |

**Throws:** `Error` if the PDF is invalid or cannot be parsed.

```js
const bytes = new Uint8Array(readFileSync("document.pdf"));
const doc = new WasmPdfDocument(bytes);
```

### Encryption & Decryption

#### `authenticate(password) -> boolean`

Decrypt an encrypted PDF. Returns `true` if authentication succeeded.

| Parameter | Type | Description |
| --- | --- | --- |
| `password` | `string` | The password string |

```js
const isAuthenticated = doc.authenticate("password123");
if (isAuthenticated) {
  console.log("PDF unlocked successfully");
}
```

#### `saveEncryptedToBytes(password, ownerPassword?, allowPrint?, allowCopy?, allowModify?, allowAnnotate?) -> Uint8Array`

Save with AES-256 encryption.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `password` | `string` | – | User password |
| `ownerPassword` | `string` | user password | Owner password |
| `allowPrint` | `boolean` | `true` | Allow printing |
| `allowCopy` | `boolean` | `true` | Allow copying |
| `allowModify` | `boolean` | `true` | Allow modification |
| `allowAnnotate` | `boolean` | `true` | Allow annotations |

```js
const encryptedBytes = doc.saveEncryptedToBytes("userPassword", "ownerPassword", true, true, true, true);
```

### Save Methods

#### `save() -> Uint8Array`

Save the edited PDF as bytes.

#### `saveWithOptions(compress?, garbageCollect?, linearize?) -> Uint8Array`

Save with explicit serialization options.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `compress` | `boolean` | `true` | Compress object streams |
| `garbageCollect` | `boolean` | `true` | Drop unreferenced objects |
| `linearize` | `boolean` | `false` | Produce a linearized ("fast web view") PDF |

#### `free()`

Release WASM memory. Always call this when done with the document.

## Key API Methods for Encryption/Decryption

### Unlock (Decrypt) PDF

```js
// Method 1: Pass password to constructor
const doc = new WasmPdfDocument(bytes, "password");

// Method 2: Use authenticate method
const doc = new WasmPdfDocument(bytes);
const success = doc.authenticate("password");
if (!success) {
  throw new Error("Incorrect password");
}
```

### Encrypt PDF

```js
const doc = new WasmPdfDocument(bytes);
// ... make any edits ...

// Save with AES-256 encryption
const encryptedBytes = doc.saveEncryptedToBytes(
  "userPassword",      // User password (required to open)
  "ownerPassword",     // Owner password (optional, for permissions)
  true,               // allowPrint
  true,               // allowCopy
  true,               // allowModify
  true                // allowAnnotate
);

// Don't forget to free memory
doc.free();
```

## Module Functions

```js
import {
  setLogLevel, disableLogging,
  generateBarcodeSvg, generateQrSvg,
  planSplitByBookmarks, splitByBookmarks,
  setCryptoPolicy, cryptoPolicy, cryptoInventory, cryptoCbom,
  modelManifest, prefetchAvailable,
  signPdfBytes, signPdfBytesPades, hasDocumentTimestamp,
} from "pdf-oxide-wasm";
```

## Feature Availability

| Feature | WASM | Notes |
| --- | --- | --- |
| Encryption | Yes | AES-256 read and write |
| Text extraction | Yes | Full support |
| Structured extraction | Yes | Chars, spans, words, lines, tables |
| PDF creation | Yes | Markdown, HTML, text, images |
| PDF editing | Yes | Metadata, rotation, dimensions, erase, pages |
| Form fields | Yes | Read, write, export, flatten, build |
| Search | Yes | Full regex support |
| Annotations | Yes | Read, flatten, redact, sanitize |
| Merge / split PDFs | Yes | Merge pages and split by bookmarks |

## Error Handling

All methods that can fail throw JavaScript `Error` objects:

```js
try {
  const doc = new WasmPdfDocument(new Uint8Array([0, 1, 2]));
} catch (e) {
  console.error(`Failed to open: ${e.message}`);
}
```

## TypeScript

Full type definitions are included in the package:

```js
import { WasmPdfDocument, WasmPdf } from "pdf-oxide-wasm";

const doc: WasmPdfDocument = new WasmPdfDocument(bytes);
const text: string = doc.extractText(0);
const pdf: WasmPdf = WasmPdf.fromMarkdown("# Hello");
```

---

Source: https://pdf.oxide.fyi/rust/docs/reference/javascript-wasm-api
