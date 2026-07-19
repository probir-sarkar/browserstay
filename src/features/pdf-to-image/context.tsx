import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import type { FileWithInfo, ImageResult, PdfToImageSettings } from "./types";
import { DEFAULT_PDF_TO_IMAGE_SETTINGS } from "./constants";

interface PdfToImageContextValue {
  file: FileWithInfo | null;
  settings: PdfToImageSettings;
  images: ImageResult[];
  error: string | null;
  setFile: (file: FileWithInfo | null) => void;
  updateSettings: (settings: Partial<PdfToImageSettings>) => void;
  setImages: (images: ImageResult[]) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const PdfToImageContext = createContext<PdfToImageContextValue | null>(null);

export function PdfToImageProvider({ children }: { children: ReactNode }) {
  const [file, setFile] = useState<FileWithInfo | null>(null);
  const [settings, setSettings] = useState<PdfToImageSettings>(DEFAULT_PDF_TO_IMAGE_SETTINGS);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const updateSettings = useCallback((newSettings: Partial<PdfToImageSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setImages([]);
    setError(null);
  }, []);

  const value: PdfToImageContextValue = {
    file,
    settings,
    images,
    error,
    setFile,
    updateSettings,
    setImages,
    setError,
    reset,
  };

  return (
    <PdfToImageContext.Provider value={value}>
      {children}
    </PdfToImageContext.Provider>
  );
}

export function usePdfToImageContext(): PdfToImageContextValue {
  const context = useContext(PdfToImageContext);
  if (!context) {
    throw new Error("usePdfToImageContext must be used within PdfToImageProvider");
  }
  return context;
}
