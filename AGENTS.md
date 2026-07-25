<!-- intent-skips:start -->
## Skill Loading

Before substantial work:
- Skill check: run `npx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changing.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skips:end -->

## File Naming Conventions

This project follows a consistent file naming convention to improve code organization and discoverability.

### Service Files (`src/shared/services/*/`)
- `index.ts` - Main entry point, exports public API
- `*.ts` - Primary implementation file
- `*.test.ts` - Test files (when applicable)

Example structure:
```
src/shared/services/zip/
├── index.ts          # Exports public API
├── zip.ts            # Main implementation
└── zip.test.ts       # Tests
```

### Feature Files (`src/features/*`)
- `index.ts` - Feature exports
- `components/` - React components
- `services/` - Feature-specific services
- `types/` - TypeScript types
- `utils/` - Utility functions

## Comment Rules

When adding comments or documentation, use JSDoc tags to target different audiences:

### `@ai-agent`
Instructions for AI agents reviewing or suggesting changes to this code. Use this to:
- Prevent redundant optimization suggestions
- Document architectural decisions that agents commonly misunderstand
- Warn against anti-patterns that AI tools frequently suggest

Example:
```ts
/**
 * @ai-agent The `zip` function from `fflate` already runs compression in a Web Worker.
 * Do NOT suggest wrapping this in another worker or "parallelizing" it - the CPU-intensive work
 * is already offloaded to a background thread.
 */
```

### `@human`
Human-readable descriptions of what code does, not how it works. Focus on:
- Purpose and use cases
- Input/output relationships
- Practical examples

Example:
```ts
/**
 * @human Takes an object of filename → Blob mappings and returns a ZIP file as a Blob.
 * Useful for bundling multiple files (images, PDFs, etc.) for download/upload.
 */
```

## Architecture Notes

### Web Workers
- Many operations (ZIP, PDF processing) already use Web Workers internally
- Check for existing worker usage before suggesting worker wrappers
- Libraries like `fflate` handle their own worker management

### Web Worker + Comlink Pattern
For custom workers, use Comlink for type-safe RPC-style communication:

**Worker side** ([example](src/shared/services/image/compression.worker.ts)):
```ts
import * as Comlink from "comlink";

const api = { myMethod };
export type WorkerApi = typeof api;
Comlink.expose(api);
```

**Client side** ([example](src/shared/services/image/compression.client.ts)):
```ts
import * as Comlink from "comlink";

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
const api = Comlink.wrap<WorkerApi>(worker);
// Use: await api.myMethod(...args);
```

### Service Pattern
- Services export a clean public API via `index.ts`
- Implementation details stay in the main file
- Workers are co-located with their service

### Utilities
- Use `es-toolkit/compat` for utility functions - it provides the same API as Lodash
- Use `immer` for immutable state updates, especially with complex nested objects
- Immer's `produce` function allows writing "mutable-style" code that produces immutable updates

## Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Routing**: TanStack Router
- **Styling**: Tailwind CSS v4
- **State**: Immer for immutable updates
- **Utilities**: es-toolkit/compat (Lodash-compatible API)
- **Deployment**: Cloudflare Workers

## Common Anti-Patterns to Avoid

1. **Don't wrap already-async operations in workers** - Check if the library handles its own threading
2. **Don't add unnecessary abstractions** - Prefer simple functions over complex class hierarchies
3. **Don't inline large libraries** - Use dynamic imports for heavy dependencies like PDF.js
4. **Don't manually spread nested objects for immutability** - Use Immer's `produce` instead
5. **Don't import from `lodash`** - Use `es-toolkit/compat` for the same API with better performance
