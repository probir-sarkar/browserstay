# BrowserStay

**Free, private, open-source PDF & image tools that stay in your browser.**

Your files never leave your PC. BrowserStay runs every tool entirely in your browser with WebAssembly — no uploads, no accounts, no servers, no limits.

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

---

## Why BrowserStay?

Most "free" online tools secretly upload your files to their servers. BrowserStay is different:

- **100% private** — Files are processed locally with WebAssembly inside a Web Worker. Nothing is ever uploaded — not to the EU, the US, China, or anywhere else. There are no servers to leak your data.
- **Open source** — Every line of code is public under the Apache 2.0 license. Auditable, forever free, and yours.
- **Local by design** — Once the page loads, all processing happens on your device. Your data stays on your computer.
- **Free, no limits** — No account, no watermark, no file-size caps, no premium paywall.

## Tools

### PDF Tools
- **PDF to Image** — Convert PDF pages to high-quality JPG or PNG images.
- **Image to PDF** — Turn images into a single PDF with sortable pages.
- **Merge PDF** — Combine multiple PDFs into one document.
- **Split PDF** — Extract specific pages or split into separate files.

### Image Tools
- **Image Converter** — Batch convert between JPG, PNG, WebP, and AVIF.
- **Image Resizer** — Resize images to any dimension with aspect-ratio control.
- **Image Compressor** — Reduce file size while keeping quality.

### Security & Developer
- **Password Generator** — Cryptographically strong passwords via the Web Crypto API.
- **QR Code Generator** — Custom QR codes for URLs, text, WiFi, and contacts.

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Routing**: TanStack Router & React Start
- **Processing**: WebAssembly codecs (via `@jsquash/*`), Web Workers + Comlink, PDF.js, pdf-lib, jsPDF
- **State**: Immer (`use-immer`)
- **Styling**: Tailwind CSS v4, class-variance-authority
- **UI Components**: Base UI / shadcn-style components
- **Tests**: Vitest with Playwright browser runner
- **Deployment**: Cloudflare Workers

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (the project is managed with `bun.lock`)

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Build

```bash
bun run build
```

Builds the production bundle with Vite, then type-checks with `tsc --noEmit`. The build also prerenders all routes and generates `sitemap.xml`.

### Test

```bash
bun run test
```

Runs the Vitest suite with the Playwright browser runner (headless Chromium).

### Deployment

```bash
bun run deploy
```

Builds and deploys to Cloudflare Workers (`wrangler deploy`). The production site is served from `https://browserstay.com`.

## Project Structure

```
src/
├── config/          # Site + tool definitions (branding, tools, links)
├── features/        # Feature modules (one per tool: image-converter, merge-pdf, ...)
│   ├── <tool>/
│   │   ├── components/   # Tool-specific UI components
│   │   ├── context.tsx   # Feature state provider
│   │   └── ...
├── lib/             # Shared library code (e.g. SEO meta config)
├── routes/          # TanStack Router file-based routes (one per tool page)
├── shared/
│   ├── components/  # Shared UI: layout (navbar, footer), common components
│   ├── hooks/       # Shared React hooks
│   ├── services/    # Worker-based services (image, pdf, zip, file, download)
│   ├── types/       # Shared TypeScript types
│   └── utils/       # Shared utilities
└── styles/          # Global CSS (Tailwind)
```

### Key files

- `src/lib/seo.ts` — Centralized SEO metadata (titles, descriptions, keywords, canonical URLs) for every route.
- `src/shared/services/image/` — Web Worker + Comlink image processing (encode, resize, compress) using `@jsquash/*` WebAssembly codecs.
- `src/shared/services/zip/` — ZIP generation for batch downloads.
- `wrangler.jsonc` — Cloudflare Workers deployment config (custom domain: `browserstay.com`).

## License

Licensed under the Apache License, Version 2.0. See the [LICENSE](LICENSE) file for details.

Copyright 2026 Probir Sarkar

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
