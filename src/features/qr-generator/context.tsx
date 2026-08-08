import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from "react";
import { useProcessingState } from "@/shared/hooks";
import { generateQRCode, type GenerateQRResult } from "./services/qr-generator";
import {
  DEFAULT_QR_SETTINGS,
  DEFAULT_WIFI_CONFIG,
  DEFAULT_VCARD_CONFIG,
  DEFAULT_SMS_CONFIG,
  DEFAULT_GEO_CONFIG,
} from "./constants";
import type {
  QRContentType,
  WiFiConfig,
  VCardConfig,
  SmsConfig,
  GeoConfig,
  QRSettings,
} from "./types";

interface QRGeneratorContextValue {
  contentType: QRContentType;
  content: string;
  wifiConfig: WiFiConfig;
  vcardConfig: VCardConfig;
  smsConfig: SmsConfig;
  geoConfig: GeoConfig;
  settings: QRSettings;
  result: GenerateQRResult | null;
  isProcessing: boolean;
  error: string | null;
  setContentType: (type: QRContentType) => void;
  setContent: (content: string) => void;
  setWifiConfig: (config: Partial<WiFiConfig>) => void;
  setVcardConfig: (config: Partial<VCardConfig>) => void;
  setSmsConfig: (config: Partial<SmsConfig>) => void;
  setGeoConfig: (config: Partial<GeoConfig>) => void;
  updateSettings: (settings: Partial<QRSettings>) => void;
  generateQR: () => Promise<void>;
  setError: (error: string | null) => void;
  reset: () => void;
}

const QRGeneratorContext = createContext<QRGeneratorContextValue | null>(null);

export function QRGeneratorProvider({ children }: { children: ReactNode }) {
  const [contentType, internalSetContentType] = useState<QRContentType>("url");
  const [content, setContent] = useState("");
  const [wifiConfig, setWifiConfigState] = useState<WiFiConfig>(DEFAULT_WIFI_CONFIG);
  const [vcardConfig, setVcardConfigState] = useState<VCardConfig>(DEFAULT_VCARD_CONFIG);
  const [smsConfig, setSmsConfigState] = useState<SmsConfig>(DEFAULT_SMS_CONFIG);
  const [geoConfig, setGeoConfigState] = useState<GeoConfig>(DEFAULT_GEO_CONFIG);
  const [settings, setSettings] = useState<QRSettings>(DEFAULT_QR_SETTINGS);
  const [result, setResult] = useState<GenerateQRResult | null>(null);

  const processingState = useProcessingState();

  const setContentType = useCallback(
    (type: QRContentType) => {
      internalSetContentType(type);
      setResult(null);
      processingState.setError(null);
    },
    [processingState]
  );

  const updateSettings = useCallback((newSettings: Partial<QRSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const setWifiConfig = useCallback((config: Partial<WiFiConfig>) => {
    setWifiConfigState((prev) => ({ ...prev, ...config }));
  }, []);

  const setVcardConfig = useCallback((config: Partial<VCardConfig>) => {
    setVcardConfigState((prev) => ({ ...prev, ...config }));
  }, []);

  const setSmsConfig = useCallback((config: Partial<SmsConfig>) => {
    setSmsConfigState((prev) => ({ ...prev, ...config }));
  }, []);

  const setGeoConfig = useCallback((config: Partial<GeoConfig>) => {
    setGeoConfigState((prev) => ({ ...prev, ...config }));
  }, []);

  const generateQR = useCallback(async () => {
    processingState.startProcessing();

    try {
      const result = await generateQRCode({
        content,
        contentType,
        wifiConfig,
        vcardConfig,
        smsConfig,
        geoConfig,
        settings,
      });
      setResult(result);
      processingState.setSuccessWithStop();
    } catch (err) {
      processingState.setErrorWithStop(err instanceof Error ? err.message : "Failed to generate QR code");
      setResult(null);
    }
  }, [content, contentType, wifiConfig, vcardConfig, smsConfig, geoConfig, settings, processingState]);

  const reset = useCallback(() => {
    setContent("");
    setResult(null);
    setWifiConfigState(DEFAULT_WIFI_CONFIG);
    setVcardConfigState(DEFAULT_VCARD_CONFIG);
    setSmsConfigState(DEFAULT_SMS_CONFIG);
    setGeoConfigState(DEFAULT_GEO_CONFIG);
    setSettings(DEFAULT_QR_SETTINGS);
    processingState.reset();
  }, [processingState]);

  const value = useMemo<QRGeneratorContextValue>(
    () => ({
      contentType,
      content,
      wifiConfig,
      vcardConfig,
      smsConfig,
      geoConfig,
      settings,
      result,
      isProcessing: processingState.isProcessing,
      error: processingState.error,
      setContentType,
      setContent,
      setWifiConfig,
      setVcardConfig,
      setSmsConfig,
      setGeoConfig,
      updateSettings,
      generateQR,
      setError: processingState.setError,
      reset,
    }),
    [
      contentType,
      content,
      wifiConfig,
      vcardConfig,
      smsConfig,
      geoConfig,
      settings,
      result,
      processingState.isProcessing,
      processingState.error,
      setContentType,
      setContent,
      setWifiConfig,
      setVcardConfig,
      setSmsConfig,
      setGeoConfig,
      updateSettings,
      generateQR,
      processingState.setError,
      reset,
    ]
  );

  return <QRGeneratorContext.Provider value={value}>{children}</QRGeneratorContext.Provider>;
}

export function useQRGeneratorContext(): QRGeneratorContextValue {
  const context = useContext(QRGeneratorContext);
  if (!context) {
    throw new Error("useQRGeneratorContext must be used within QRGeneratorProvider");
  }
  return context;
}

/**
 * Convenience hook exposing the shared processing state that lives in the
 * provider — not a detached copy.
 */
export function useQRGeneratorState() {
  const { result, ...context } = useQRGeneratorContext();
  return { ...context, result };
}
