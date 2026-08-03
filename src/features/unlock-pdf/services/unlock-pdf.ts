import init, { WasmPdfDocument } from "pdf-oxide-wasm/web";
import type { UnlockResult } from "../types";

let wasmInitialized = false;

async function ensureWasmInitialized() {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
}

export async function unlockPdf(
  file: File,
  password: string
): Promise<UnlockResult> {
  await ensureWasmInitialized();

  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = new WasmPdfDocument(bytes);

  try {
    const isAuthenticated = doc.authenticate(password);
    if (!isAuthenticated) {
      throw new Error("Incorrect password or unsupported PDF encryption.");
    }

    const pdfBytes = new Uint8Array(doc.save());

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    return {
      blob,
      fileName: `${file.name.replace(/\.pdf$/i, "")}-unlocked.pdf`,
    };
  } finally {
    doc.free();
  }
}
