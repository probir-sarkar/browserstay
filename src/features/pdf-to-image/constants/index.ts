import type { PdfToImageSettings } from "../types";

export const DEFAULT_PDF_TO_IMAGE_SETTINGS: PdfToImageSettings = {
  scale: 2.0,
  startPage: 1,
  endPage: null
} as const;
