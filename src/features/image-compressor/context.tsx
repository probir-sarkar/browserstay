import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import type { ImageFile, CompressionSettings } from "./types";
import { DEFAULT_COMPRESSION_SETTINGS } from "./constants";
import { createImageFile } from "./services/image-compressor";
import { useFileHandler } from "@/shared/hooks";
import { useProcessingState } from "@/shared/hooks";

interface ImageCompressorContextValue {
  files: ImageFile[];
  settings: CompressionSettings;
  isCompressing: boolean;
  error: string | null;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateSettings: (settings: Partial<CompressionSettings>) => void;
  setIsCompressing: (isCompressing: boolean) => void;
  setError: (error: string | null) => void;
  updateCompressedSize: (id: string, size: number) => void;
}

const ImageCompressorContext = createContext<ImageCompressorContextValue | null>(null);

export function ImageCompressorProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<CompressionSettings>(DEFAULT_COMPRESSION_SETTINGS);

  const fileHandler = useFileHandler<ImageFile>({
    createFile: createImageFile,
    validateFile: (file: File) => file.type.startsWith('image/'),
  });

  const processingState = useProcessingState();

  const updateCompressedSize = useCallback((id: string, size: number) => {
    // Get current files and update the specific one
    const updatedFiles = fileHandler.files.map((f) =>
      f.id === id
        ? {
            ...f,
            compressedSize: size,
            compressionRatio: ((f.originalSize - size) / f.originalSize) * 100,
          }
        : f
    );
    fileHandler.setFiles(updatedFiles);
  }, [fileHandler]);

  const updateSettings = useCallback((newSettings: Partial<CompressionSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const setError = useCallback((error: string | null) => {
    fileHandler.setError(error);
    processingState.setError(error);
  }, [fileHandler, processingState]);

  const value: ImageCompressorContextValue = {
    files: fileHandler.files,
    settings,
    isCompressing: processingState.isProcessing,
    error: fileHandler.error || processingState.error,
    addFiles: fileHandler.addFiles,
    removeFile: fileHandler.removeFile,
    clearFiles: fileHandler.clearFiles,
    updateSettings,
    setIsCompressing: processingState.setIsProcessing,
    setError,
    updateCompressedSize,
  };

  return (
    <ImageCompressorContext.Provider value={value}>
      {children}
    </ImageCompressorContext.Provider>
  );
}

export function useImageCompressorContext(): ImageCompressorContextValue {
  const context = useContext(ImageCompressorContext);
  if (!context) {
    throw new Error("useImageCompressorContext must be used within ImageCompressorProvider");
  }
  return context;
}
