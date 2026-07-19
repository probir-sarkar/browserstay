import { type FileInfo, type ImageResult } from "@/shared/services/pdf";

export type { FileInfo, ImageResult };

export interface PdfToImageSettings {
  scale: number;
  startPage: number;
  endPage: number | null;
}
