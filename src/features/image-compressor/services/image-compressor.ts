import type { ImageFile } from "../types";

export interface CompressResult {
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export function createImageFile(file: File): ImageFile {
  const preview = URL.createObjectURL(file);
  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    preview,
    originalSize: file.size
  };
}

export function revokeImageFilePreview(file: ImageFile): void {
  URL.revokeObjectURL(file.preview);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
