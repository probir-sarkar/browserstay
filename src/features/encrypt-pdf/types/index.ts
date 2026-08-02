export interface EncryptPdfFile {
  file: File;
  fileName: string;
  fileSize: number;
}

export interface EncryptResult {
  blob: Blob;
  fileName: string;
}
