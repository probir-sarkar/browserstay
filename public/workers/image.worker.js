// @ts-check
// This worker is served as a static module from /image.worker.js, so every import
// must resolve in the browser at runtime (hence the CDN imports). The shared types
// below are referenced via JSDoc `import()` only — TypeScript resolves them at
// compile time and emits nothing, so client and worker stay in sync without
// breaking the runtime module graph.
import * as Comlink from "https://esm.sh/comlink@4.4.2";
import { encode as encodeJpeg, decode as decodeJpeg } from "https://esm.sh/@jsquash/jpeg@1.6.0/es2022/jpeg.mjs";
import { encode as encodeWebp, decode as decodeWebp } from "https://esm.sh/@jsquash/webp@1.5.0/es2022/webp.mjs";
import { encode as encodePng, decode as decodePng } from "https://esm.sh/@jsquash/png@3.1.1/es2022/png.mjs";
import { encode as encodeAvif, decode as decodeAvif } from "https://esm.sh/@jsquash/avif@2.1.1/es2022/avif.mjs";

/** @typedef {import("../../src/shared/services/image/types").ImageFormat} ImageFormat */
/** @typedef {import("../../src/shared/services/image/types").EncodeImageOptions} EncodeImageOptions */
/** @typedef {import("../../src/shared/services/image/types").ResizeWorkerOptions} ResizeWorkerOptions */
/** @typedef {import("../../src/shared/services/image/types").CompressImageOptions} CompressImageOptions */
/** @typedef {import("../../src/shared/services/image/types").ImageTransparencyInfo} ImageTransparencyInfo */
/** @typedef {import("../../src/shared/services/image/types").EncodeImageResult} EncodeImageResult */
/** @typedef {import("../../src/shared/services/image/types").ImageWorkerApi} ImageWorkerApi */

/** @type {Record<ImageFormat, string>} */
const MIME_TYPE = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif"
};

/**
 * Decodes a File into raw pixel data. Uses the matching @jsquash codec for the
 * file's MIME type; falls back to a generic canvas decode for other image types.
 * @param {File} file
 * @returns {Promise<ImageData>}
 */
async function decodeToImageData(file) {
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

/**
 * Encodes ImageData into the requested format. PNG ignores quality.
 * @param {ImageData} imageData
 * @param {EncodeImageOptions | ResizeWorkerOptions | CompressImageOptions} options
 * @returns {Promise<ArrayBuffer>}
 */
async function encodeImageData(imageData, options) {
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
      throw new Error(`Unsupported output format: ${outputFormat}`);
  }
}

/**
 * @param {File} file
 * @param {ImageFormat} format
 * @param {ArrayBuffer} encoded
 * @returns {EncodeImageResult}
 */
function buildResult(file, format, encoded) {
  const outputFile = new File([encoded], file.name, { type: MIME_TYPE[format] });
  const originalSize = file.size;
  const outputSize = outputFile.size;
  return {
    outputFile,
    originalSize,
    outputSize,
    ratio: originalSize > 0 ? ((originalSize - outputSize) / originalSize) * 100 : 0
  };
}

/**
 * @param {File} file
 * @param {EncodeImageOptions} options
 * @returns {Promise<EncodeImageResult>}
 */
async function encodeImageWorker(file, options) {
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");
  const imageData = await decodeToImageData(file);
  const encoded = await encodeImageData(imageData, options);
  return buildResult(file, options.outputFormat, encoded);
}

/**
 * @param {File} file
 * @param {ResizeWorkerOptions} options
 * @returns {Promise<EncodeImageResult>}
 */
async function resizeImageWorker(file, options) {
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");

  const imageData = await decodeToImageData(file);
  const { targetWidth, targetHeight } = options;
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not supported");

  const bitmap = await createImageBitmap(imageData);
  try {
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  } finally {
    bitmap.close();
  }

  const resizedData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const encoded = await encodeImageData(resizedData, options);
  return buildResult(file, options.outputFormat, encoded);
}

/**
 * @param {File} file
 * @param {CompressImageOptions} options
 * @returns {Promise<EncodeImageResult>}
 */
async function compressImageWorker(file, options) {
  if (!file.type.startsWith("image/")) throw new Error("File must be an image");

  let data = await decodeToImageData(file);
  const { maxDimension } = options;

  // Scale down to fit within maxDimension while preserving aspect ratio.
  if (maxDimension && maxDimension > 0 && (data.width > maxDimension || data.height > maxDimension)) {
    const scale = Math.min(maxDimension / data.width, maxDimension / data.height);
    const width = Math.round(data.width * scale);
    const height = Math.round(data.height * scale);

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context not supported");

    const bitmap = await createImageBitmap(data);
    try {
      ctx.drawImage(bitmap, 0, 0, width, height);
    } finally {
      bitmap.close();
    }
    data = ctx.getImageData(0, 0, width, height);
  }

  const encoded = await encodeImageData(data, options);
  return buildResult(file, options.outputFormat, encoded);
}

/**
 * Samples up to 10,000 pixels to estimate how much of the image is transparent.
 * @param {File} file
 * @returns {Promise<ImageTransparencyInfo>}
 */
async function checkImageTransparencyWorker(file) {
  const imageData = await decodeToImageData(file);
  const pixels = imageData.data;
  let alphaCount = 0;
  // Sample every Nth pixel for performance on large images.
  const step = Math.max(1, Math.floor(pixels.length / 10000));
  for (let i = 3; i < pixels.length; i += 4 * step) {
    if (pixels[i] < 255) alphaCount++;
  }
  const sampleCount = Math.ceil(pixels.length / 4 / step);
  return {
    hasAlpha: alphaCount > 0,
    alphaPixelPercent: sampleCount > 0 ? (alphaCount / sampleCount) * 100 : 0
  };
}

/** @type {ImageWorkerApi} */
const api = { encodeImageWorker, resizeImageWorker, compressImageWorker, checkImageTransparencyWorker };
Comlink.expose(api);
