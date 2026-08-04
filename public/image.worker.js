import * as Comlink from "https://esm.sh/comlink@4.4.2";
import { encode as encodeJpeg, decode as decodeJpeg } from "https://esm.sh/@jsquash/jpeg@1.6.0/es2022/jpeg.mjs";
import { encode as encodeWebp, decode as decodeWebp } from "https://esm.sh/@jsquash/webp@1.0.0/es2022/webp.mjs";
import { encode as encodePng, decode as decodePng } from "https://esm.sh/@jsquash/png@1.0.0/es2022/png.mjs";
import { encode as encodeAvif, decode as decodeAvif } from "https://esm.sh/@jsquash/avif@1.0.0/es2022/avif.mjs";

/**
 * @typedef {'jpeg' | 'png' | 'webp' | 'avif'} ImageFormat
 */

/**
 * @typedef {Object} EncodeImageOptions
 * @property {ImageFormat} outputFormat
 * @property {number} quality
 */

/**
 * @typedef {Object} ResizeWorkerOptions
 * @property {ImageFormat} outputFormat
 * @property {number} quality
 * @property {number} targetWidth
 * @property {number} targetHeight
 */

/**
 * @typedef {Object} CompressImageOptions
 * @property {ImageFormat} outputFormat
 * @property {number} quality
 * @property {number} [maxDimension]
 */

/**
 * @typedef {Object} ImageTransparencyInfo
 * @property {boolean} hasAlpha
 * @property {number} alphaPixelPercent
 */

/**
 * @typedef {Object} EncodeImageResult
 * @property {File} outputFile
 * @property {number} originalSize
 * @property {number} outputSize
 * @property {number} ratio
 */

/**
 * @typedef {Object} ImageWorkerApi
 * @property {(file: File, options: EncodeImageOptions) => Promise<EncodeImageResult>} encodeImageWorker
 * @property {(file: File, options: ResizeWorkerOptions) => Promise<EncodeImageResult>} resizeImageWorker
 * @property {(file: File, options: CompressImageOptions) => Promise<EncodeImageResult>} compressImageWorker
 * @property {(file: File) => Promise<ImageTransparencyInfo>} checkImageTransparencyWorker
 */

const MIME_TYPE = {
  /** @type {ImageFormat} */
  jpeg: "image/jpeg",
  /** @type {ImageFormat} */
  png: "image/png",
  /** @type {ImageFormat} */
  webp: "image/webp",
  /** @type {ImageFormat} */
  avif: "image/avif"
};

/**
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
 * @param {EncodeImageOptions} options
 * @returns {Promise<EncodeImageResult>}
 */
async function encodeImageWorker(file, options) {
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

/**
 * @param {File} file
 * @param {ResizeWorkerOptions} options
 * @returns {Promise<EncodeImageResult>}
 */
async function resizeImageWorker(file, options) {
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

/**
 * @param {File} file
 * @param {CompressImageOptions} options
 * @returns {Promise<EncodeImageResult>}
 */
async function compressImageWorker(file, options) {
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

/**
 * @param {File} file
 * @returns {Promise<ImageTransparencyInfo>}
 */
async function checkImageTransparencyWorker(file) {
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

/** @type {ImageWorkerApi} */
const api = { encodeImageWorker, resizeImageWorker, compressImageWorker, checkImageTransparencyWorker };
Comlink.expose(api);
