import type { ImageFormat } from "@/shared/services";

export interface ConverterFile {
  id: string;
  file: File;
  preview: string;
  originalSize: number;
  convertedSize?: number;
  conversionRatio?: number;
}

export interface ConversionSettings {
  outputFormat: ImageFormat;
  quality: number;
}
