export type ImageFormat = "jpeg" | "png" | "webp" | "avif";

export interface EncodeImageOptions {
  outputFormat: ImageFormat;
  quality: number;
}

export interface CompressImageOptions {
  outputFormat: ImageFormat;
  quality: number;
  /** If set, images wider/taller than this are scaled down to fit before encoding. */
  maxDimension?: number;
}

export interface ResizeWorkerOptions {
  outputFormat: ImageFormat;
  quality: number;
  targetWidth: number;
  targetHeight: number;
}

export interface ImageTransparencyInfo {
  /** Whether the image has any translucent or fully transparent pixels. */
  hasAlpha: boolean;
  /** Approximate percentage of pixels that are not fully opaque. */
  alphaPixelPercent: number;
}
