import * as Comlink from "comlink";
import { encode as encodeJpeg, decode as decodeJpeg } from "@jsquash/jpeg";
import { encode as encodeWebp, decode as decodeWebp } from "@jsquash/webp";
import { encode as encodePng, decode as decodePng } from "@jsquash/png";
import { encode as encodeAvif, decode as decodeAvif } from "@jsquash/avif";
import type { EncodeImageOptions, ResizeWorkerOptions, ImageFormat } from "./types";

export interface EncodeImageResult {
  outputFile: File;
  originalSize: number;
  outputSize: number;
  ratio: number;
}

const MIME_TYPE: Record<ImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif"
};

async function decodeToImageData(file: File): Promise<ImageData> {
  const buffer = await file.arrayBuffer();
  const type = file.type;

  if (type === "image/png") return decodePng(buffer);
  if (type === "image/jpeg") return decodeJpeg(buffer);
  if (type === "image/webp") return decodeWebp(buffer);
  if (type === "image/avif") {
    const data = await decodeAvif(buffer);
    if (!data) throw new Error("Failed to decode AVIF image");
    return data;
  }

  const bitmap = await createImageBitmap(file);
  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not supported");
    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

async function encodeImageData(imageData: ImageData, options: EncodeImageOptions | ResizeWorkerOptions): Promise<ArrayBuffer> {
  const { outputFormat, quality } = options;
  if (quality < 1 || quality > 100) throw new Error("Quality must be between 1 and 100");
  switch (outputFormat) {
    case "jpeg":
      return encodeJpeg(imageData, { quality });
    case "webp":
      return encodeWebp(imageData, { quality });
    case "avif":
      return encodeAvif(imageData, { quality });
    case "png":
      return encodePng(imageData);
    default:
      throw new Error(`Unsupported output format: ${outputFormat as string}`);
  }
}

async function encodeImageWorker(file: File, options: EncodeImageOptions): Promise<EncodeImageResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const imageData = await decodeToImageData(file);
  const encoded = await encodeImageData(imageData, options);
  const outputFile = new File([encoded], file.name, {
    type: MIME_TYPE[options.outputFormat]
  });

  return {
    outputFile,
    originalSize: file.size,
    outputSize: outputFile.size,
    ratio: ((file.size - outputFile.size) / file.size) * 100
  };
}

async function resizeImageWorker(file: File, options: ResizeWorkerOptions): Promise<EncodeImageResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const imageData = await decodeToImageData(file);
  const canvas = new OffscreenCanvas(options.targetWidth, options.targetHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not supported");

  const bitmap = await createImageBitmap(imageData);
  ctx.drawImage(bitmap, 0, 0, options.targetWidth, options.targetHeight);
  bitmap.close();

  const resizedData = ctx.getImageData(0, 0, options.targetWidth, options.targetHeight);
  const encoded = await encodeImageData(resizedData, options);
  const outputFile = new File([encoded], file.name, {
    type: MIME_TYPE[options.outputFormat]
  });

  return {
    outputFile,
    originalSize: file.size,
    outputSize: outputFile.size,
    ratio: ((file.size - outputFile.size) / file.size) * 100
  };
}

const api = { encodeImageWorker, resizeImageWorker };
export type ImageWorkerApi = typeof api;

Comlink.expose(api);
