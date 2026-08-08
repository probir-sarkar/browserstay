import type { QRSettings, WiFiConfig, VCardConfig, SmsConfig, GeoConfig, QRCodeColor, ErrorCorrectionLevel } from "../types";

export const DEFAULT_QR_SETTINGS: QRSettings = {
  size: 300,
  color: "black",
  backgroundColor: "#FFFFFF",
  transparent: false,
  errorCorrectionLevel: "M",
  margin: 2,
};

export const DEFAULT_WIFI_CONFIG: WiFiConfig = {
  ssid: "",
  password: "",
  encryption: "WPA",
  hidden: false,
};

export const DEFAULT_VCARD_CONFIG: VCardConfig = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  organization: "",
  website: "",
};

export const DEFAULT_SMS_CONFIG: SmsConfig = {
  phone: "",
  message: "",
};

export const DEFAULT_GEO_CONFIG: GeoConfig = {
  latitude: "",
  longitude: "",
};

export const COLOR_MAP: Record<Exclude<QRCodeColor, "custom">, string> = {
  black: "#000000",
  blue: "#2563EB",
  red: "#DC2626",
  green: "#16A34A",
  purple: "#7C3AED",
  teal: "#0D9488",
  orange: "#EA580C",
};

export const COLOR_OPTIONS: Array<{ value: QRCodeColor; label: string; hex: string }> = [
  { value: "black", label: "Black", hex: COLOR_MAP.black },
  { value: "blue", label: "Blue", hex: COLOR_MAP.blue },
  { value: "purple", label: "Purple", hex: COLOR_MAP.purple },
  { value: "teal", label: "Teal", hex: COLOR_MAP.teal },
  { value: "green", label: "Green", hex: COLOR_MAP.green },
  { value: "orange", label: "Orange", hex: COLOR_MAP.orange },
  { value: "red", label: "Red", hex: COLOR_MAP.red },
  { value: "custom", label: "Custom", hex: "#000000" },
];

export const SIZE_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 256, label: "256px" },
  { value: 300, label: "300px" },
  { value: 384, label: "384px" },
  { value: 512, label: "512px" },
  { value: 1024, label: "1024px" },
];

export const ERROR_CORRECTION_OPTIONS: Array<{ value: ErrorCorrectionLevel; label: string; description: string }> = [
  { value: "L", label: "Low (7%)", description: "Smallest code, least resilience" },
  { value: "M", label: "Medium (15%)", description: "Good default for most uses" },
  { value: "Q", label: "Quartile (25%)", description: "Higher resilience, larger code" },
  { value: "H", label: "High (30%)", description: "Most resilience, largest code" },
];

export const MARGIN_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 1, label: "Minimal" },
  { value: 2, label: "Small" },
  { value: 4, label: "Standard" },
];

export const WIFI_ENCRYPTION_OPTIONS: Array<{ value: WiFiConfig["encryption"]; label: string }> = [
  { value: "WPA", label: "WPA/WPA2" },
  { value: "WEP", label: "WEP" },
  { value: "nopass", label: "None" },
];
