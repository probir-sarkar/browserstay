import type { CompressionSettings } from "../types";

export const DEFAULT_COMPRESSION_SETTINGS: CompressionSettings = {
  quality: 80,
  outputFormat: "jpeg"
};

export const OUTPUT_FORMATS = [
  { value: "jpeg", label: "JPEG (Best compression)" },
  { value: "webp", label: "WebP (Modern format)" }
] as const;

export const QUALITY_RANGE = { min: 1, max: 100, step: 1 };
