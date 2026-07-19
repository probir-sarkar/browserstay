import { openPdf, extractPdf } from "clawpdf/browser";
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

async function pdfToImages(file: File, options: PdfToImageOptions = {}): Promise<ImageResult[]> {
  const { scale = 2, startPage = 1, endPage } = options;
  const baseName = getBaseName(file);
  const pdf = await openPdf(file);
  const lastPage = Math.min(endPage ?? pdf.pageCount, pdf.pageCount);
  const pagesArray = Array.from({ length: lastPage - startPage + 1 }, (_, i) => startPage + i);
  const extracted = await extractPdf(file, {
    mode: "images",
    pages: pagesArray,
    image: {
      scale: scale
    }
  });
  return extracted.images.map((image) => ({
    page: image.page,
    bytes: image.bytes,
    mimeType: image.mimeType,
    filename: `${baseName}-page-${image.page}.png`,
    baseName
  }));
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

export interface FileInfo {
  name: string;
  size: number;
  pages: number;
  file: File;
}

async function getFileInfo(file: File): Promise<FileInfo> {
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
