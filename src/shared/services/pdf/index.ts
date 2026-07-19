import { createZip } from "../zip";
import { getPdfjsLibWithWorker } from "./processor";
import { openPdf } from "clawpdf/browser";

function getBaseName(file: File): string {
  const name = file.name.replace(/\.[^/.]+$/, ""); // remove extension
  return name || "document";
}

export interface PdfToImageOptions {
  scale?: number;
  startPage?: number;
  endPage?: number | null;
}

export type ImageResult = {
  page: number;
  blob: Blob;
  filename: string;
  baseName: string;
  url: string;
};

export async function pdfToImagesBrowser(file: File, options: PdfToImageOptions = {}): Promise<ImageResult[]> {
  const { scale = 2, startPage = 1, endPage } = options;
  const baseName = getBaseName(file);
  const fileData = await file.arrayBuffer();
  const pdf = await openPdf(new Uint8Array(fileData));
  const lastPage = Math.min(endPage ?? pdf.pageCount, pdf.pageCount);
  const results: ImageResult[] = [];
  for (let pageNum = startPage; pageNum <= lastPage; pageNum++) {
    const page = pdf.page(pageNum);
    const pngBytes = await page.png({ scale });

    const blob = new Blob([pngBytes as unknown as BlobPart], { type: "image/png" });
    const url = URL.createObjectURL(blob);

    results.push({
      page: pageNum,
      blob,
      filename: `${baseName}-page-${pageNum}.png`,
      baseName,
      url
    });
  }

  return results;
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

export async function downloadAll(images: ImageResult[]) {
  if (!images.length) return;

  const baseName = images[0].baseName || "document";
  const files = Object.fromEntries(images.map((img) => [`${baseName}/${img.filename}`, img.blob]));
  const blob = await createZip(files);
  triggerDownload(blob, `${baseName}-images.zip`);
}

export interface FileInfo {
  name: string;
  size: number;
  pages: number;
  file: File;
}

export async function getFileInfo(file: File): Promise<FileInfo> {
  const name = file.name;
  const size = file.size; // raw bytes

  let pages = 0;

  if (file.type === "application/pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await getPdfjsLibWithWorker();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    pages = pdf.numPages;
  }
  return {
    name,
    size,
    pages,
    file
  };
}
