import { type FileWithInfo, type ImageResult } from "@/shared/services/pdf";

export type { FileWithInfo, ImageResult };

export interface PdfToImageSettings {
  scale: number;
  startPage: number;
  endPage: number | null;
}
