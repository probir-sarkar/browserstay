import { PDFDocument } from "@cantoo/pdf-lib";
import type { EncryptResult } from "../types";

export async function encryptPdf(
  file: File,
  password: string
): Promise<EncryptResult> {
  const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
  pdfDoc.encrypt({ userPassword: password });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  return {
    blob,
    fileName: `${file.name.replace(/\.pdf$/i, "")}-encrypted.pdf`,
  };
}
