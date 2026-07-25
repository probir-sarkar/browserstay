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
