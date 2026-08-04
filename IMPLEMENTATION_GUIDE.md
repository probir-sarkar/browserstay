# Implementation Guide

This guide documents the project structure, patterns, and conventions for implementing new features and maintaining the BrowserStay toolbox.

## Project Overview

BrowserStay is a privacy-first suite of PDF and image tools that run entirely in the browser. No files are uploaded to servers—all processing happens locally using WebAssembly and Web Workers.

## Architecture

### Directory Structure

```
src/
├── config/              # Configuration files
│   ├── site.ts         # Site-wide settings
│   └── tools.ts        # Tool metadata and navigation config
├── features/           # Individual tool features
│   ├── encrypt-pdf/    # Example feature structure
│   │   ├── components/
│   │   ├── constants/
│   │   ├── context.tsx
│   │   ├── index.ts
│   │   └── types/
│   └── [other features...]
├── lib/                # General-purpose utilities
│   └── seo.ts          # SEO utilities
├── shared/             # Shared code across features
│   ├── components/     # Reusable UI components
│   ├── constants/      # Shared constants (MIME types, limits, errors)
│   ├── hooks/          # Custom React hooks
│   ├── services/       # Core services (download, file, image, pdf, zip)
│   ├── testing/        # Test utilities and fixtures
│   ├── types/          # Shared TypeScript types
│   └── utils/          # Utility functions
└── [app files...]
```

## Feature Structure Template

Every feature follows this structure:

```
feature-name/
├── components/           # Feature-specific components
│   ├── action-card.tsx  # Main action component
│   ├── drop-zone.tsx    # File drop zone
│   ├── file-list.tsx    # File list display
│   └── settings.tsx     # Settings/controls
├── constants/
│   └── index.ts         # Feature constants (default settings, limits)
├── types/
│   └── index.ts         # Feature-specific types
├── services/            # Optional: feature-specific services
│   └── feature-name.ts  # Core processing logic
├── context.tsx          # React Context provider
├── index.ts             # Feature entry point
└── feature-name.tsx     # Main page component
```

## Adding a New Feature

### 1. Create Feature Directory

```bash
mkdir -p src/features/your-feature/{components,constants,types}
```

### 2. Define Types

`src/features/your-feature/types/index.ts`:
```typescript
export interface YourFeatureFile {
  id: string;
  file: File;
  // Add feature-specific properties
}

export interface YourFeatureSettings {
  // Add settings properties
}

export interface YourFeatureResult {
  // Define result structure
}
```

### 3. Create Constants

`src/features/your-feature/constants/index.ts`:
```typescript
import type { YourFeatureSettings } from "../types";

export const DEFAULT_YOUR_FEATURE_SETTINGS: YourFeatureSettings = {
  // Default values
};

export const YOUR_FEATURE_LIMITS = {
  MAX_FILES: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};
```

### 4. Create Context Provider

`src/features/your-feature/context.tsx`:
```typescript
import { createContext, useContext, ReactNode } from "react";
import type { YourFeatureFile, YourFeatureSettings } from "./types";
import { DEFAULT_YOUR_FEATURE_SETTINGS } from "./constants";
import { useFileHandler } from "@/shared/hooks";
import { useProcessingState } from "@/shared/hooks";

interface YourFeatureContextValue {
  files: YourFeatureFile[];
  settings: YourFeatureSettings;
  isProcessing: boolean;
  error: string | null;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateSettings: (settings: Partial<YourFeatureSettings>) => void;
  setError: (error: string | null) => void;
}

const YourFeatureContext = createContext<YourFeatureContextValue | null>(null);

export function YourFeatureProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<YourFeatureSettings>(
    DEFAULT_YOUR_FEATURE_SETTINGS
  );

  const fileHandler = useFileHandler<YourFeatureFile>({
    validateFile: (file) => true, // Add validation
    createFile: (file) => ({ id: generateId(), file }),
  });

  const processingState = useProcessingState();

  const value: YourFeatureContextValue = {
    files: fileHandler.files,
    settings,
    isProcessing: processingState.isProcessing,
    error: fileHandler.error || processingState.error,
    addFiles: fileHandler.addFiles,
    removeFile: fileHandler.removeFile,
    clearFiles: fileHandler.clearFiles,
    updateSettings: (newSettings) =>
      setSettings((prev) => ({ ...prev, ...newSettings })),
    setError: (error) => {
      fileHandler.setError(error);
      processingState.setError(error);
    },
  };

  return (
    <YourFeatureContext.Provider value={value}>
      {children}
    </YourFeatureContext.Provider>
  );
}

export function useYourFeatureContext(): YourFeatureContextValue {
  const context = useContext(YourFeatureContext);
  if (!context) {
    throw new Error("useYourFeatureContext must be used within YourFeatureProvider");
  }
  return context;
}
```

### 5. Add to Tools Config

`src/config/tools.ts`:
```typescript
{
  title: "Your Feature",
  href: "/your-feature",
  description: "Brief description",
  icon: YourIcon,
  color: "bg-color-500/10 text-color-600",
  tags: ["tag1", "tag2"]
}
```

### 6. Add SEO Configuration

`src/lib/seo.ts` - Add to `metaConfigs`:
```typescript
yourFeature: {
  title: "Your Feature - Free Online | BrowserStay",
  description: "Description",
  canonicalUrl: `${BASE_URL}/your-feature`,
  keywords: "keyword1, keyword2, keyword3"
}
```

## Shared Services

### PDF Service

Located at: `src/shared/services/pdf/index.ts`

```typescript
import { PdfService } from "@/shared/services";

// Get file info (name, size, page count)
const info = await PdfService.getFileInfo(file);

// Convert PDF to images
const images = await PdfService.pdfToImages(file, { scale: 2 });

// Extract specific pages
const blob = await PdfService.extractPagesAsPdf(file, [0, 1, 2]);

// Split all pages
const files = await PdfService.splitAllPages(file, pageCount, baseName);

// PDF encryption
import { encryptPdf, unlockPdf, isPdfEncrypted } from "@/shared/services";
const encrypted = await encryptPdf(file, password);
const unlocked = await unlockPdf(file, password);
const isEncrypted = await isPdfEncrypted(file);
```

### Download Service

Located at: `src/shared/services/download/index.ts`

```typescript
import { downloadBlob } from "@/shared/services";

// Trigger browser download
downloadBlob(blob, "filename.pdf");
```

### File Service

Located at: `src/shared/services/file/index.ts`

```typescript
import { getBaseName, getFileExtension } from "@/shared/services";

// Get filename without extension
const baseName = getBaseName(file); // "document" from "document.pdf"

// Get file extension
const ext = getFileExtension(file); // "pdf" from "document.pdf"
```

### Zip Service

Located at: `src/shared/services/zip/index.ts`

```typescript
import { createZip } from "@/shared/services";

// Create ZIP from files
const zipBlob = await createZip({
  "file1.pdf": file1Blob,
  "file2.pdf": file2Blob,
});
```

## Shared Hooks

### useFileHandler

Manages file state with automatic cleanup:

```typescript
const {
  files,           // Current files
  error,           // Error state
  addFiles,        // Add new files
  removeFile,      // Remove file by ID
  clearFiles,      // Clear all files
  setFiles,        // Set files directly
  setError,        // Set error
} = useFileHandler<YourFile>({
  validateFile: (file) => file.type === "application/pdf",
  createFile: (file) => createYourFile(file),
  onAdd: (files) => console.log("Files added"),
  onRemove: (id) => console.log("File removed"),
});
```

### useProcessingState

Manages processing/loading state:

```typescript
const {
  isProcessing,       // Processing flag
  error,             // Error message
  success,           // Success flag
  startProcessing,   // Start processing
  stopProcessing,    // Stop processing
  setError,         // Set error
  setSuccess,        // Set success
  setErrorWithStop,  // Set error and stop
  setSuccessWithStop, // Set success and stop
  reset,            // Reset all state
} = useProcessingState();
```

## Shared Utilities

### Class Names

```typescript
import { cn } from "@/shared/utils";

// Merge Tailwind classes
const className = cn("base-class", condition && "conditional-class");
```

### Validation (to be implemented)

```typescript
import { validatePdfFile, validateImageFile, MIME_TYPES } from "@/shared/utils";

// Validate files
if (validatePdfFile(file)) {
  // Process PDF
}

// Check MIME types
if (file.type === MIME_TYPES.PDF) {
  // Handle PDF
}
```

## Component Patterns

### Drop Zone

Use the shared drop zone component:

```typescript
import { DropZoneBase } from "@/shared/components/common";

<DropZoneBase
  onDrop={(files) => addFiles(files)}
  accept={{ "application/pdf": [".pdf"] }}
  multiple={true}
  maxFiles={10}
/>
```

### File List

Use the shared file list component:

```typescript
import { FileListBase } from "@/shared/components/common";

<FileListBase
  files={files}
  onRemove={(id) => removeFile(id)}
  renderItem={(file) => (
    <YourFileItem file={file} onRemove={() => removeFile(file.id)} />
  )}
/>
```

## Error Handling

Always provide user-friendly error messages:

```typescript
try {
  // Processing logic
} catch (error) {
  if (error instanceof Error) {
    setError(`Processing failed: ${error.message}`);
  } else {
    setError("An unexpected error occurred");
  }
}
```

## Performance Guidelines

1. **Use Web Workers for CPU-intensive tasks**
   - Image processing already uses workers
   - Consider workers for large PDF operations

2. **Limit concurrent operations**
   ```typescript
   import pLimit from "p-limit";
   const limit = pLimit(4); // Max 4 concurrent operations
   ```

3. **Clean up resources**
   - Revoke object URLs for previews
   - Terminate workers when done
   - Clear file state on unmount

## TypeScript Guidelines

1. **Always type function parameters and returns**
2. **Use interface for object shapes**
3. **Use type for unions/intersections**
4. **Export types used by other modules**
5. **Prefer readonly for immutable data**

## Testing Guidelines

1. **Write tests for utilities first**
2. **Test error cases, not just happy paths**
3. **Use fixtures for consistent test data**
4. **Mock browser APIs (URL.createObjectURL, etc.)**

## Checklist for New Features

- [ ] Feature directory created with proper structure
- [ ] Types defined and exported
- [ ] Constants defined with defaults
- [ ] Context provider implemented
- [ ] Components created (drop-zone, file-list, settings)
- [ ] Service logic implemented (or uses shared services)
- [ ] Added to tools config
- [ ] SEO configuration added
- [ ] Route created in router
- [ ] Error handling implemented
- [ ] File validation implemented
- [ ] Download functionality tested
- [ ] Multiple file support tested
- [ ] Edge cases tested (empty files, large files, etc.)
- [ ] Performance checked (large file processing)
- [ ] Accessibility verified (keyboard nav, screen readers)

## Common Patterns

### Processing Files

```typescript
async function processFiles() {
  startProcessing();
  setError(null);

  try {
    const results = await Promise.all(
      files.map(async (file) => {
        return await processFile(file);
      })
    );

    setSuccessWithStop();
    return results;
  } catch (error) {
    setErrorWithStop(error instanceof Error ? error.message : "Processing failed");
    return null;
  }
}
```

### Downloading Results

```typescript
import { downloadBlob } from "@/shared/services";

function downloadResults(results: ProcessedFile[]) {
  if (results.length === 1) {
    downloadBlob(results[0].blob, results[0].filename);
  } else {
    // Create ZIP for multiple files
    const zip = await createZip(
      Object.fromEntries(results.map(r => [r.filename, r.blob]))
    );
    downloadBlob(zip, "results.zip");
  }
}
```

## Resources

- **TanStack Router**: Route management
- **TanStack Start**: Full-stack framework
- **React 19**: UI framework
- **Tailwind CSS v4**: Styling
- **Vite**: Build tool
- **Vitest**: Testing
- **TypeScript**: Type system
- **@cantoo/pdf-lib**: PDF processing
- **clawpdf**: PDF to image conversion
- **@jsquash/***: Image format conversion
- **fflate**: ZIP compression
- **p-limit**: Concurrency control
- **Comlink**: Web Worker communication
