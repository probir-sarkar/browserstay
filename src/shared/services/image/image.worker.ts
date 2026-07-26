import * as Comlink from "comlink";
import { encode as encodeJpeg, decode as decodeJpeg } from "@jsquash/jpeg";
import { encode as encodeWebp, decode as decodeWebp } from "@jsquash/webp";
import { encode as encodePng, decode as decodePng } from "@jsquash/png";
import { encode as encodeAvif, decode as decodeAvif } from "@jsquash/avif";
import type {
  EncodeImageOptions,
  ResizeWorkerOptions,
  CompressImageOptions,
  ImageFormat,
  ImageTransparencyInfo,
} from "./types";

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

async function compressImageWorker(file: File, options: CompressImageOptions): Promise<EncodeImageResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  const imageData = await decodeToImageData(file);
  let { width, height } = imageData;
  let data = imageData;

  // Auto-resize: scale down to fit within maxDimension while preserving aspect ratio
  if (options.maxDimension && options.maxDimension > 0) {
    const max = options.maxDimension;
    if (width > max || height > max) {
      const ratio = Math.min(max / width, max / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas 2D context not supported");

      const bitmap = await createImageBitmap(data);
      ctx.drawImage(bitmap, 0, 0, width, height);
      bitmap.close();
      data = ctx.getImageData(0, 0, width, height);
    }
  }

  const encoded = await encodeImageData(data, options);
  const outputFile = new File([encoded], file.name, {
    type: MIME_TYPE[options.outputFormat],
  });

  return {
    outputFile,
    originalSize: file.size,
    outputSize: outputFile.size,
    ratio: ((file.size - outputFile.size) / file.size) * 100,
  };
}

async function checkImageTransparencyWorker(file: File): Promise<ImageTransparencyInfo> {
  const imageData = await decodeToImageData(file);
  const pixels = imageData.data;
  let alphaCount = 0;
  // Sample every Nth pixel for performance on large images
  const step = Math.max(1, Math.floor(pixels.length / 10000));
  for (let i = 3; i < pixels.length; i += 4 * step) {
    if (pixels[i] < 255) alphaCount++;
  }
  const sampleCount = Math.ceil(pixels.length / 4 / step);
  return {
    hasAlpha: alphaCount > 0,
    alphaPixelPercent: sampleCount > 0 ? (alphaCount / sampleCount) * 100 : 0,
  };
}

const api = { encodeImageWorker, resizeImageWorker, compressImageWorker, checkImageTransparencyWorker };
export type ImageWorkerApi = typeof api;

Comlink.expose(api);
