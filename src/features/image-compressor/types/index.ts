export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  compressedSize?: number;
  compressionRatio?: number;
}

export interface CompressionSettings {
  quality: number;
  outputFormat: "jpeg" | "webp";
}
