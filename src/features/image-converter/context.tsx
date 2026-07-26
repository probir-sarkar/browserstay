import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { ConverterFile, ConversionSettings } from "./types";
import { DEFAULT_CONVERSION_SETTINGS } from "./constants";
import { createConverterFile } from "./services/image-converter";
import { useFileHandler, useProcessingState } from "@/shared/hooks";

interface ImageConverterContextValue {
  files: ConverterFile[];
  settings: ConversionSettings;
  isConverting: boolean;
  error: string | null;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateSettings: (settings: Partial<ConversionSettings>) => void;
  setIsConverting: (isConverting: boolean) => void;
  setError: (error: string | null) => void;
  updateConvertedSize: (id: string, size: number) => void;
}

const ImageConverterContext = createContext<ImageConverterContextValue | null>(null);

export function ImageConverterProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ConversionSettings>(DEFAULT_CONVERSION_SETTINGS);

  const fileHandler = useFileHandler<ConverterFile>({
    createFile: createConverterFile,
    validateFile: (file: File) => file.type.startsWith("image/"),
  });

  const processingState = useProcessingState();

  const updateConvertedSize = useCallback((id: string, size: number) => {
    fileHandler.setFiles((prevFiles) =>
      prevFiles.map((f) =>
        f.id === id
          ? {
              ...f,
              convertedSize: size,
              conversionRatio: ((f.originalSize - size) / f.originalSize) * 100,
            }
          : f
      )
    );
  }, [fileHandler]);

  const updateSettings = useCallback((newSettings: Partial<ConversionSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const setError = useCallback((error: string | null) => {
    fileHandler.setError(error);
    processingState.setError(error);
  }, [fileHandler, processingState]);

  const value: ImageConverterContextValue = {
    files: fileHandler.files,
    settings,
    isConverting: processingState.isProcessing,
    error: fileHandler.error || processingState.error,
    addFiles: fileHandler.addFiles,
    removeFile: fileHandler.removeFile,
    clearFiles: fileHandler.clearFiles,
    updateSettings,
    setIsConverting: processingState.setIsProcessing,
    setError,
    updateConvertedSize,
  };

  return (
    <ImageConverterContext.Provider value={value}>
      {children}
    </ImageConverterContext.Provider>
  );
}

export function useImageConverterContext(): ImageConverterContextValue {
  const context = useContext(ImageConverterContext);
  if (!context) {
    throw new Error("useImageConverterContext must be used within ImageConverterProvider");
  }
  return context;
}
