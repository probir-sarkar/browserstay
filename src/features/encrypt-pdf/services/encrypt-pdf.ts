import init, { WasmPdfDocument } from "pdf-oxide-wasm/web";
import type { EncryptResult } from "../types";

let wasmInitialized = false;

async function ensureWasmInitialized() {
  if (!wasmInitialized) {
    await init();
    wasmInitialized = true;
  }
}

export async function encryptPdf(
  file: File,
  password: string
): Promise<EncryptResult> {
  await ensureWasmInitialized();

  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = new WasmPdfDocument(bytes);

  try {
    const encryptedBytes = doc.saveEncryptedToBytes(password);

    const blob = new Blob([new Uint8Array(encryptedBytes)], { type: "application/pdf" });
    return {
      blob,
      fileName: `${file.name.replace(/\.pdf$/i, "")}-encrypted.pdf`,
    };
  } finally {
    doc.free();
  }
}
