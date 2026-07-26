export type ImageFormat = "jpeg" | "png" | "webp" | "avif";

export interface EncodeImageOptions {
  outputFormat: ImageFormat;
  quality: number;
}

export interface ResizeWorkerOptions {
  outputFormat: ImageFormat;
  quality: number;
  targetWidth: number;
  targetHeight: number;
}
