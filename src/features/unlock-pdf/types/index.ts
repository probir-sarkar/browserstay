export interface UnlockPdfFile {
  file: File;
  fileName: string;
  fileSize: number;
}

export interface UnlockResult {
  blob: Blob;
  fileName: string;
}
