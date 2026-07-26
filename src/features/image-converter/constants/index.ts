import type { ConversionSettings } from "../types";

export const DEFAULT_CONVERSION_SETTINGS: ConversionSettings = {
  outputFormat: "webp",
  quality: 100,
};

export const OUTPUT_FORMATS = [
  { value: "webp", label: "WebP", desc: "Best compression & quality" },
  { value: "jpeg", label: "JPEG", desc: "Universal format" },
  { value: "png", label: "PNG", desc: "Lossless format" },
  { value: "avif", label: "AVIF", desc: "Next-gen format" },
] as const;

export const QUALITY_RANGE = { min: 1, max: 100, step: 1 };

export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
