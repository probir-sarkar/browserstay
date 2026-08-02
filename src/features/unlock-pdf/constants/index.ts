import type { UnlockPdfFile } from "../types";

export const ACCEPTED_FILE_TYPES = ["application/pdf"];

export function createUnlockFile(file: File): UnlockPdfFile {
  return {
    file,
    fileName: file.name.replace(/\.pdf$/i, ""),
    fileSize: file.size,
  };
}
