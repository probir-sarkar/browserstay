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
 * Draws ImageData onto a canvas at the given target dimensions and returns the
 * resampled ImageData. Shared by resize and downscale-before-compress paths so
 * resampling behavior (smoothing quality) stays consistent between them.
 * @param {ImageData} imageData
 * @param {number} targetWidth
 * @param {number} targetHeight
 * @returns {Promise<ImageData>}
 */
async function resampleImageData(imageData, targetWidth, targetHeight) {
  const canvas = new OffscreenCanvas(targetWidth, targetHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not supported");

  // Explicit so resampling quality doesn't silently vary across browser defaults.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const bitmap = await createImageBitmap(imageData);
  try {
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  } finally {
    bitmap.close();
  }

  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * @param {File} file
 * @param {ImageFormat} format
 * @param {ArrayBuffer} encoded
 * @returns {EncodeImageResult}
 */
function buildResult(file, format, encoded) {
  const mimeType = MIME_TYPE[format];
  if (!mimeType) throw new Error(`Unsupported output format: ${format}`);

  const outputFile = new File([encoded], file.name, { type: mimeType });
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
  const resizedData = await resampleImageData(imageData, targetWidth, targetHeight);
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
  // Intentionally shrink-only — compression should never upscale a source image.
  if (maxDimension && maxDimension > 0 && (data.width > maxDimension || data.height > maxDimension)) {
    const scale = Math.min(maxDimension / data.width, maxDimension / data.height);
    const width = Math.round(data.width * scale);
    const height = Math.round(data.height * scale);
    data = await resampleImageData(data, width, height);
  }

  const encoded = await encodeImageData(data, options);
  return buildResult(file, options.outputFormat, encoded);
}

/** @type {ImageWorkerApi} */
const api = { encodeImageWorker, resizeImageWorker, compressImageWorker };
Comlink.expose(api);
