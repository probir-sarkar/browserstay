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
  /** Max dimension preset (0 = original). Applied as maxDimension in the worker. */
  maxDimension: number;
}

export interface DimensionPreset {
  label: string;
  value: number;
}
