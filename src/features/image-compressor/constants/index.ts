import type { CompressionSettings, DimensionPreset } from "../types";

export const DEFAULT_COMPRESSION_SETTINGS: CompressionSettings = {
  quality: 80,
  outputFormat: "jpeg",
  maxDimension: 0
};

export const OUTPUT_FORMATS = [
  { value: "jpeg", label: "JPEG (Best compression)" },
  { value: "webp", label: "WebP (Modern format)" }
] as const;

export const QUALITY_RANGE = { min: 1, max: 100, step: 1 };

export const DIMENSION_PRESETS: DimensionPreset[] = [
  { label: "Original", value: 0 },
  { label: "Full HD (1920px)", value: 1920 },
  { label: "HD (1280px)", value: 1280 },
  { label: "720p (720px)", value: 720 },
  { label: "480p (480px)", value: 480 }
];
