import { PdfService } from "@/shared/services";
import type { SplitPdfFile } from "../types";

export async function loadPdfFile(file: File): Promise<SplitPdfFile> {
  const info = await PdfService.getFileInfo(file);
  return { file, fileName: info.name, fileSize: info.size, pageCount: info.pages };
}

export async function extractPages(file: File, pageIndices: number[]): Promise<Blob> {
  return PdfService.extractPagesAsPdf(file, pageIndices);
}

export async function splitAllPages(file: File, pageCount: number, baseName: string): Promise<Record<string, Blob>> {
  return PdfService.splitAllPages(file, pageCount, baseName);
}
