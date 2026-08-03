import { PDFDocument } from "@cantoo/pdf-lib";
import { getBaseName } from "../file";

export interface EncryptPdfResult {
  blob: Blob;
  fileName: string;
}

export interface UnlockPdfResult {
  blob: Blob;
  fileName: string;
}

async function saveToBlob(pdfDoc: PDFDocument, file: File, suffix: string): Promise<EncryptPdfResult> {
  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return {
    blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
    fileName: `${getBaseName(file)}-${suffix}.pdf`
  };
}

/** Returns true if the PDF is password-protected. */
export async function isPdfEncrypted(file: File): Promise<boolean> {
  const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  return doc.isEncrypted;
}

export async function encryptPdf(file: File, password: string): Promise<EncryptPdfResult> {
  const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
  pdfDoc.encrypt({ userPassword: password });

  return saveToBlob(pdfDoc, file, "encrypted");
}

export async function unlockPdf(file: File, password: string): Promise<UnlockPdfResult> {
  if (!(await isPdfEncrypted(file))) {
    throw new Error("This PDF is not password-protected.");
  }

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(await file.arrayBuffer(), { password });
  } catch {
    throw new Error("Incorrect password or unsupported PDF encryption.");
  }

  return saveToBlob(pdfDoc, file, "unlocked");
}
