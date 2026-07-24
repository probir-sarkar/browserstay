import { PdfService } from "@/shared/services";
import type { SplitPdfFile } from "../types";
import { PDFDocument } from "pdf-lib";

export async function loadPdfFile(file: File): Promise<SplitPdfFile> {
  const info = await PdfService.getFileInfo(file);
  return { file, fileName: info.name, fileSize: info.size, pageCount: info.pages };
}

export async function extractPages(file: File, pageIndices: number[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));
  const pdfBytes = await newPdf.save({
    useObjectStreams: true
  });
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}

export async function splitAllPages(file: File, pageCount: number, baseName: string): Promise<Record<string, Blob>> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const files: Record<string, Blob> = {};

  for (let i = 0; i < pageCount; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save({
      useObjectStreams: true
    });

    files[`${baseName}-page-${i + 1}.pdf`] = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
  }

  return files;
}
