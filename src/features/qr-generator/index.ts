// Main component
export { QRGenerator } from "./qr-generator";

// Context
export { QRGeneratorProvider, useQRGeneratorContext, useQRGeneratorState } from "./context";

// Types
export type {
  QRContentType,
  QRCodeColor,
  ErrorCorrectionLevel,
  WiFiConfig,
  VCardConfig,
  SmsConfig,
  GeoConfig,
  QRSettings,
} from "./types";

// Constants
export {
  DEFAULT_QR_SETTINGS,
  DEFAULT_WIFI_CONFIG,
  DEFAULT_VCARD_CONFIG,
  DEFAULT_SMS_CONFIG,
  DEFAULT_GEO_CONFIG,
  COLOR_MAP,
  COLOR_OPTIONS,
  SIZE_OPTIONS,
  ERROR_CORRECTION_OPTIONS,
  MARGIN_OPTIONS,
  WIFI_ENCRYPTION_OPTIONS,
} from "./constants";

// Service
export { generateQRCode, getContrastRatio, downloadPng, downloadSvg } from "./services/qr-generator";
export type { GenerateQROptions, GenerateQRResult } from "./services/qr-generator";
