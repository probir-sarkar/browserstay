import { openPdf } from "clawpdf/browser";
import { createZip } from "../zip";
import pLimit from "p-limit";
import { PDFDocument } from "pdf-lib";
import { getBaseName } from "../file";


export interface PdfToImageOptions {
  scale?: number;
  startPage?: number;
  endPage?: number | null;
}
export interface ImageResult {
  page: number;
  bytes: Uint8Array;
  mimeType: string;
  filename: string;
  baseName: string;
}

async function pdfToImages(
  file: File,
  options: PdfToImageOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<ImageResult[]> {
  const { scale = 2, startPage = 1, endPage } = options;
  const baseName = getBaseName(file);
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await openPdf(arrayBuffer);
  const lastPage = Math.min(endPage ?? pdf.pageCount, pdf.pageCount);
  const pagesArray = Array.from({ length: lastPage - startPage + 1 }, (_, i) => startPage + i);

  // Handle invalid page range (P1 fix): empty pagesArray means no pages to process
  if (pagesArray.length === 0) {
    onProgress?.(1, 1); // Signal completion to prevent stuck progress
    return [];
  }

  // Process pages concurrently with p-limit (P2 fix)
  const limit = pLimit(10); // Process up to 10 pages in parallel
  const images: ImageResult[] = [];
  let completed = 0;

  const tasks = pagesArray.map((page) =>
    limit(async () => {
      const png = await pdf.page(page).png({ scale });
      const result = {
        page,
        bytes: png,
        mimeType: "image/png",
        filename: `${baseName}-page-${page}.png`,
        baseName
      };
      // Report progress as each page completes
      completed++;
      onProgress?.(completed, pagesArray.length);
      return result;
    })
  );

  const results = await Promise.all(tasks);
  images.push(...results);

  return images;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

async function downloadAll(images: ImageResult[]) {
  if (!images.length) return;
  const baseName = images[0].baseName || "document";
  const files = Object.fromEntries(images.map((img) => [`${baseName}/${img.filename}`, img.bytes]));
  const blob = await createZip(files);
  triggerDownload(blob, `${baseName}-images.zip`);
}

export interface FileWithInfo {
  name: string;
  size: number;
  pages: number;
  file: File;
}

async function getFileInfo(file: File): Promise<FileWithInfo> {
  const name = file.name;
  const size = file.size; // raw bytes
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pageCount = pdfDoc.getPageCount();

  if (pageCount === 0) {
    throw new Error("The PDF file contains no pages. Please select a valid PDF with at least one page.");
  }

  return {
    name,
    size,
    pages: pageCount,
    file
  };
}

async function extractPagesAsPdf(file: File, pageIndices: number[]): Promise<Blob> {
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

async function splitAllPages(file: File, pageCount: number, baseName: string): Promise<Record<string, Blob>> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const limit = pLimit(10); // Process up to 10 pages in parallel
  const files: Record<string, Blob> = {};

  const tasks = Array.from({ length: pageCount }, (_, i) =>
    limit(async () => {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
      const pdfBytes = await newPdf.save({
        useObjectStreams: true
      });

      files[`${baseName}-page-${i + 1}.pdf`] = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
    })
  );

  await Promise.all(tasks);

  return files;
}

export const PdfService = { pdfToImages, downloadAll, getFileInfo, extractPagesAsPdf, splitAllPages };
