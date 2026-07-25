// worker.ts
import { expose } from "comlink";
import type { CompressionSettings, CompressResult } from "./types";
import { encode as encodeJpeg, decode as decodeJpeg } from "@jsquash/jpeg";
import { encode as encodeWebp, decode as decodeWebp } from "@jsquash/webp";
import { decode as decodePng } from "@jsquash/png";

async function decodeToImageData(file: File): Promise<ImageData> {
  const buffer = await file.arrayBuffer();
  const type = file.type;

  if (type === "image/png") return decodePng(buffer);
  if (type === "image/jpeg") return decodeJpeg(buffer);
  if (type === "image/webp") return decodeWebp(buffer);

  // Fallback for formats jsquash doesn't decode (e.g. avif, gif, svg):
  // let the browser decode it via canvas, then hand off ImageData.
  const bitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0);
  return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
}

async function compressImage(file: File, settings: CompressionSettings): Promise<CompressResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }
  const imageData = await decodeToImageData(file);
  const format = settings.outputFormat;

  let encoded: ArrayBuffer;
  let mimeType: string;

  switch (format) {
    case "jpeg": {
      const { quality } = settings;
      encoded = await encodeJpeg(imageData, { quality });
      mimeType = "image/jpeg";
      break;
    }
    case "webp": {
      const { quality } = settings;
      encoded = await encodeWebp(imageData, { quality });
      mimeType = "image/webp";
      break;
    }
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  const compressedFile = new File([encoded], file.name, { type: mimeType });

  return {
    compressedFile,
    originalSize: file.size,
    compressedSize: compressedFile.size,
    compressionRatio: ((file.size - compressedFile.size) / file.size) * 100
  };
}

// Expose the compressImage function to the main thread
const workerApi = { compressImage };
export type WorkerApi = typeof workerApi;

expose(workerApi);
