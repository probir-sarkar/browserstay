import { createContext, useContext, ReactNode, useState } from "react";
import type { EncryptPdfFile } from "./types";
import { useProcessingState } from "@/shared/hooks";

interface EncryptPdfContextValue {
  fileData: EncryptPdfFile | null;
  isProcessing: boolean;
  error: string | null;
  setFile: (file: EncryptPdfFile | null) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const EncryptPdfContext = createContext<EncryptPdfContextValue | null>(null);

export function EncryptPdfProvider({ children }: { children: ReactNode }) {
  const [fileData, setFileData] = useState<EncryptPdfFile | null>(null);
  const processingState = useProcessingState();

  const setFile = (file: EncryptPdfFile | null) => {
    setFileData(file);
    processingState.setError(null);
  };

  const setError = (error: string | null) => {
    processingState.setError(error);
  };

  const reset = () => {
    setFileData(null);
    processingState.setError(null);
    processingState.setIsProcessing(false);
  };

  const value: EncryptPdfContextValue = {
    fileData,
    isProcessing: processingState.isProcessing,
    error: processingState.error,
    setFile,
    setIsProcessing: processingState.setIsProcessing,
    setError,
    reset,
  };

  return (
    <EncryptPdfContext.Provider value={value}>
      {children}
    </EncryptPdfContext.Provider>
  );
}

export function useEncryptPdfContext(): EncryptPdfContextValue {
  const context = useContext(EncryptPdfContext);
  if (!context) {
    throw new Error("useEncryptPdfContext must be used within EncryptPdfProvider");
  }
  return context;
}
