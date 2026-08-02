import { PDFDocument } from "@cantoo/pdf-lib";
import type { UnlockResult } from "../types";

export async function unlockPdf(file: File, password: string): Promise<UnlockResult> {

  let source;
  try {
    source = await PDFDocument.load(await file.arrayBuffer(), { password });
  } catch {
    throw new Error("Incorrect password or unsupported PDF encryption.");
  }

  // This saves without any encryption
  const pdfBytes = await source.save({
    useObjectStreams: true
  });

  const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
  return {
    blob,
    fileName: `${file.name.replace(/\.pdf$/i, "")}-unlocked.pdf`
  };
}
