import type { EncryptPdfFile } from "../types";

export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export function createEncryptFile(file: File): EncryptPdfFile {
  return {
    file,
    fileName: file.name.replace(/\.pdf$/i, ""),
    fileSize: file.size,
  };
}
