import type { EncryptPdfFile } from "../types";
import { isPdfEncrypted } from "@/shared/services/pdf";

export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export async function createEncryptFile(file: File): Promise<EncryptPdfFile> {
  const isEncrypted = await isPdfEncrypted(file);
  return {
    file,
    fileName: file.name.replace(/\.pdf$/i, ""),
    fileSize: file.size,
    isEncrypted,
  };
}
