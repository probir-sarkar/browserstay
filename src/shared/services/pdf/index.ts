import { openPdf } from "clawpdf/browser";
import { createZip } from "../zip";

function getBaseName(file: File): string {
  const name = file.name.replace(/\.[^/.]+$/, ""); // remove extension
  return name || "document";
}

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
  const pdf = await openPdf(file);
  const lastPage = Math.min(endPage ?? pdf.pageCount, pdf.pageCount);
  const pagesArray = Array.from({ length: lastPage - startPage + 1 }, (_, i) => startPage + i);
  const images: ImageResult[] = [];

  for (let i = 0; i < pagesArray.length; i++) {
    const page = pagesArray[i];
    const png = await pdf.page(page).png({ scale });
    images.push({
      page,
      bytes: png,
      mimeType: "image/png",
      filename: `${baseName}-page-${page}.png`,
      baseName
    });
    // Report progress after each page
    onProgress?.(i + 1, pagesArray.length);
  }
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
  const pdf = await openPdf(file);
  return {
    name,
    size,
    pages: pdf.pageCount,
    file
  };
}

export const PdfService = { pdfToImages, downloadAll, getFileInfo };
