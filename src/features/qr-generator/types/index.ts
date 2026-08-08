export type QRContentType =
  | "url"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "geo"
  | "wifi"
  | "vcard";

export type QRCodeColor = "black" | "blue" | "red" | "green" | "purple" | "teal" | "orange" | "custom";
export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface WiFiConfig {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardConfig {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  organization: string;
  website: string;
}

export interface SmsConfig {
  phone: string;
  message: string;
}

export interface GeoConfig {
  latitude: string;
  longitude: string;
}

export interface QRSettings {
  size: number;
  color: QRCodeColor;
  customColor?: string;
  backgroundColor: string;
  /** When true the quiet zone / background is fully transparent. */
  transparent: boolean;
  errorCorrectionLevel: ErrorCorrectionLevel;
  /** Quiet zone width in modules (qrcode `margin` option). */
  margin: number;
}
