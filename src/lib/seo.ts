/**
 * Centralized SEO Utility Functions
 *
 * This module provides reusable functions and configurations for managing
 * SEO metadata across the application. All meta tag definitions should
 * use these utilities to ensure consistency and maintainability.
 */

import { AnyRouteMatch } from "@tanstack/react-router";

export interface MetaConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  canonicalUrl: string;
  keywords?: string;
}

/**
 * Generates complete SEO metadata configuration for a route
 * @param config - SEO configuration object
 * @returns TanStack Router compatible head configuration
 */
export function generateMeta(config: MetaConfig): {
  links?: AnyRouteMatch["links"];
  meta?: AnyRouteMatch["meta"];
} {
  const {
    title,
    description,
    ogTitle = title,
    ogDescription = description,
    twitterCard = "summary_large_image",
    canonicalUrl,
    keywords
  } = config;

  return {
    meta: [
      { title },
      { name: "description", content: description },
      ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      { property: "og:title", content: ogTitle },
      { property: "og:description", content: ogDescription },
      { property: "og:image", content: `${BASE_URL}/og-image.png` },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonicalUrl },
      { name: "twitter:card", content: twitterCard },
      { name: "twitter:title", content: ogTitle },
      { name: "twitter:description", content: ogDescription },
      { name: "twitter:image", content: `${BASE_URL}/og-image.png` }
    ],
    links: [{ rel: "canonical", href: canonicalUrl }]
  };
}

/**
 * Generates canonical URL for a given path
 * @param path - The path (e.g., '/merge-pdf')
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash if present and ensure consistent formatting
  const cleanPath = path.replace(/\/$/, "");
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Predefined SEO configurations for all main routes
 * Add new routes here to maintain centralized SEO management
 */
export const BASE_URL = "https://browserstay.com";

export const metaConfigs = {
  home: {
    title: "BrowserStay - Free Privacy-First PDF & Image Tools, No Uploads",
    description:
      "Free, private PDF and image tools that run entirely in your browser. Your files never leave your PC — no uploads, no accounts, no servers, no limits.",
    canonicalUrl: `${BASE_URL}/`,
    keywords: "pdf tools, image tools, merge pdf, compress image, privacy tools, no upload, browser pdf, browserstay"
  },
  pdfToImage: {
    title: "PDF to Image Converter - Free & Private | BrowserStay",
    description:
      "Convert PDF pages to high-quality JPG or PNG images for free. 100% in your browser with WebAssembly — no uploads, and nothing ever leaves your PC.",
    canonicalUrl: `${BASE_URL}/pdf-to-image`,
    keywords: "pdf to image, convert pdf to jpg, pdf to png, pdf converter, local pdf to image, browserstay"
  },
  mergePdf: {
    title: "Merge PDF Files - Free Online PDF Combiner | BrowserStay",
    description:
      "Combine multiple PDF files into one document for free. Merge PDFs in seconds — no uploads, no registration, 100% private and processed locally in your browser.",
    canonicalUrl: `${BASE_URL}/merge-pdf`,
    keywords: "merge pdf, combine pdf, join pdf, pdf combiner, merge pdf files free, local merge pdf, browserstay"
  },
  splitPdf: {
    title: "Split PDF File - Extract Pages Free Online | BrowserStay",
    description:
      "Split PDF files and extract pages for free. Separate a PDF into individual pages or extract specific ranges — all locally in your browser, no uploads, 100% private.",
    canonicalUrl: `${BASE_URL}/split-pdf`,
    keywords: "split pdf, extract pages from pdf, split pdf online, pdf page extractor, local split pdf, browserstay"
  },
  imageConverter: {
    title: "Image Converter - Convert Images Online Free | BrowserStay",
    description:
      "Convert images between JPG, PNG, WebP, and AVIF free. High-quality WebAssembly encoding runs entirely in your browser — no uploads, no limits, 100% private.",
    canonicalUrl: `${BASE_URL}/image-converter`,
    keywords:
      "image converter, convert jpg to png, webp to jpg, avif converter, image format converter, local image converter, browserstay"
  },
  imageToPdf: {
    title: "Image to PDF Converter - Convert Images to PDF Free | BrowserStay",
    description:
      "Convert images (JPG, PNG, WebP) to PDF documents. Sortable pages, custom settings, fully local processing. Free and private — your images never leave your device.",
    canonicalUrl: `${BASE_URL}/image-to-pdf`,
    keywords:
      "image to pdf, jpg to pdf, png to pdf, photos to pdf, image to pdf converter, local image to pdf, browserstay"
  },
  imageResize: {
    title: "Image Resizer - Resize Images Online Free | BrowserStay",
    description:
      "Resize images to any dimension for free. Maintain aspect ratio, batch process multiple images, convert formats — all in your browser with no uploads.",
    canonicalUrl: `${BASE_URL}/image-resize`,
    keywords:
      "image resizer, resize image, resize jpg, resize png, image dimensions, batch resize images, local resizer, browserstay"
  },
  imageCompressor: {
    title: "Image Compressor - Compress Images Online Free | BrowserStay",
    description:
      "Compress images to reduce file size while keeping quality. Smart compression, batch processing, multiple formats — 100% free, private, and processed locally.",
    canonicalUrl: `${BASE_URL}/image-compressor`,
    keywords:
      "image compressor, compress image, reduce image size, compress jpg, compress png, photo compressor, local compression, browserstay"
  },
  qrGenerator: {
    title: "QR Code Generator - Create Custom QR Codes Free | BrowserStay",
    description:
      "Generate custom QR codes for URLs, text, WiFi, and contacts. Customizable colors, sizes, and error correction. 100% free, private, and generated in your browser.",
    canonicalUrl: `${BASE_URL}/qr-generator`,
    keywords:
      "qr code generator, create qr code, wifi qr code, qr code for url, custom qr code, free qr generator, browserstay"
  },
  passwordGenerator: {
    title: "Secure Password Generator - Free Online Tool | BrowserStay",
    description:
      "Generate strong, secure passwords instantly in your browser using the Web Crypto API. Customizable length and character types. Fully local — nothing is stored or sent.",
    canonicalUrl: `${BASE_URL}/password-generator`,
    keywords:
      "password generator, strong password, random password, secure password, password creator, local password generator, browserstay"
  }
} as const;

/**
 * Type-safe meta configuration keys
 */
export type MetaConfigKey = keyof typeof metaConfigs;

/**
 * Helper function to get meta config by key
 * @param key - The meta config key
 * @returns The meta configuration object
 */
export function getMetaConfig(key: MetaConfigKey): MetaConfig {
  return metaConfigs[key];
}

/**
 * Generates meta tags for a specific route using predefined config
 * @param key - The meta config key
 * @returns TanStack Router compatible head configuration
 */
export function generateMetaFromKey(key: MetaConfigKey) {
  return generateMeta(metaConfigs[key]);
}
