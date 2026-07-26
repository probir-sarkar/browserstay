/**
 * Shared image core types.
 *
 * Used by both the image-compressor and image-converter features, which are
 * thin UI shells over the single jSquash Web Worker in this directory.
 */

export type ImageFormat = "jpeg" | "png" | "webp" | "avif";

export interface EncodeImageOptions {
  outputFormat: ImageFormat;
  /**
   * UI quality on a 1–100 scale.
   * Applied to lossy formats (jpeg/webp/avif) — normalized to 0–1 in the worker.
   * Ignored for png (lossless).
   */
  quality: number;
}
