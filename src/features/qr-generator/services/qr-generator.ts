import type { QRSettings, QRContentType, WiFiConfig, VCardConfig, SmsConfig, GeoConfig } from "../types";
import { COLOR_MAP } from "../constants";
import QRCode from "qrcode";

export interface GenerateQROptions {
  content: string;
  contentType: QRContentType;
  wifiConfig: WiFiConfig;
  vcardConfig: VCardConfig;
  smsConfig: SmsConfig;
  geoConfig: GeoConfig;
  settings: QRSettings;
}

export interface GenerateQRResult {
  /** SVG string for crisp, scalable output and copy-to-clipboard. */
  svg: string;
  /** PNG data URL rendered at the configured size. */
  png: string;
  /** The exact payload that was encoded. */
  payload: string;
}

/** Splits a hex color like `#RRGGBB` into `[r, g, b]` values. */
function hexToRgb(hex: string): [number, number, number] | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const value = parseInt(match[1], 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/**
 * Computes a rough luminance contrast ratio (WCAG-style) between two hex colors.
 * Returns `null` when either color is invalid, so callers can skip the check.
 */
export function getContrastRatio(dark: string, light: string): number | null {
  const a = hexToRgb(dark);
  const b = hexToRgb(light);
  if (!a || !b) return null;

  const luminance = (rgb: [number, number, number]) => {
    const [r, g, bl] = rgb.map((channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };

  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function resolveColors(settings: QRSettings): { dark: string; light: string } {
  const dark = settings.color === "custom" ? settings.customColor || "#000000" : COLOR_MAP[settings.color] || COLOR_MAP.black;
  const light = settings.transparent ? "#00000000" : settings.backgroundColor;
  return { dark, light };
}

/**
 * Builds the payload that gets encoded based on the selected content type.
 * Throws a user-facing error when required fields are missing.
 */
function buildPayload(
  contentType: QRContentType,
  content: string,
  wifiConfig: WiFiConfig,
  vcardConfig: VCardConfig,
  smsConfig: SmsConfig,
  geoConfig: GeoConfig
): string {
  switch (contentType) {
    case "url": {
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Enter a URL to encode.");
      return trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
    }

    case "text": {
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Enter some text to encode.");
      return trimmed;
    }

    case "email": {
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Enter an email address to encode.");
      return `mailto:${trimmed}`;
    }

    case "phone": {
      const trimmed = content.trim();
      if (!trimmed) throw new Error("Enter a phone number to encode.");
      return `tel:${trimmed}`;
    }

    case "sms": {
      const phone = smsConfig.phone.trim();
      if (!phone) throw new Error("Enter a phone number for the SMS.");
      const message = smsConfig.message.trim();
      return message ? `SMSTO:${phone}:${message}` : `SMSTO:${phone}`;
    }

    case "geo": {
      const lat = geoConfig.latitude.trim();
      const lng = geoConfig.longitude.trim();
      if (!lat || !lng) throw new Error("Enter both latitude and longitude.");
      const latitude = Number(lat);
      const longitude = Number(lng);
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error("Enter valid latitude (-90 to 90) and longitude (-180 to 180).");
      }
      return `geo:${latitude},${longitude}`;
    }

    case "wifi": {
      if (!wifiConfig.ssid.trim()) throw new Error("Enter the WiFi network name (SSID).");
      const ssid = escapeWifiValue(wifiConfig.ssid);
      const password = escapeWifiValue(wifiConfig.password);
      const hidden = wifiConfig.hidden ? "true" : "false";
      return `WIFI:T:${wifiConfig.encryption};S:${ssid};P:${password};H:${hidden};;`;
    }

    case "vcard": {
      const firstName = vcardConfig.firstName.trim();
      const lastName = vcardConfig.lastName.trim();
      if (!firstName && !lastName) throw new Error("Enter at least a first or last name.");
      const fullName = `${firstName} ${lastName}`.trim();
      const parts = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName};${firstName}`,
        `FN:${fullName}`,
        vcardConfig.organization.trim() && `ORG:${vcardConfig.organization.trim()}`,
        vcardConfig.phone.trim() && `TEL:${vcardConfig.phone.trim()}`,
        vcardConfig.email.trim() && `EMAIL:${vcardConfig.email.trim()}`,
        vcardConfig.website.trim() && `URL:${vcardConfig.website.trim()}`,
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
      return parts;
    }
  }
}

/** Escapes characters that have special meaning in the WiFi QR payload. */
function escapeWifiValue(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export async function generateQRCode(options: GenerateQROptions): Promise<GenerateQRResult> {
  const { content, contentType, wifiConfig, vcardConfig, smsConfig, geoConfig, settings } = options;

  const payload = buildPayload(contentType, content, wifiConfig, vcardConfig, smsConfig, geoConfig);
  const { dark, light } = resolveColors(settings);

  const contrast = getContrastRatio(dark, light);
  if (contrast !== null && contrast < 2.2) {
    throw new Error("The QR code colors are too low-contrast to scan reliably. Pick a darker code color or a lighter background.");
  }

  const [svg, png] = await Promise.all([
    QRCode.toString(payload, {
      type: "svg",
      margin: settings.margin,
      width: settings.size,
      color: { dark, light },
      errorCorrectionLevel: settings.errorCorrectionLevel,
    }),
    QRCode.toDataURL(payload, {
      margin: settings.margin,
      width: settings.size,
      color: { dark, light },
      errorCorrectionLevel: settings.errorCorrectionLevel,
    }),
  ]);

  return { svg, png, payload };
}

/** Downloads a PNG data URL as a file. */
export function downloadPng(png: string, filename: string): void {
  const link = document.createElement("a");
  link.href = png;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** Downloads an SVG string as a file. */
export function downloadSvg(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
