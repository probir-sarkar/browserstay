import { createContext, useContext, ReactNode, useState } from "react";
import type { UnlockPdfFile } from "./types";
import { useProcessingState } from "@/shared/hooks";

interface UnlockPdfContextValue {
  fileData: UnlockPdfFile | null;
  password: string;
  isProcessing: boolean;
  error: string | null;
  setFile: (file: UnlockPdfFile | null) => void;
  setPassword: (password: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const UnlockPdfContext = createContext<UnlockPdfContextValue | null>(null);

export function UnlockPdfProvider({ children }: { children: ReactNode }) {
  const [fileData, setFileData] = useState<UnlockPdfFile | null>(null);
  const [password, setPasswordState] = useState("");
  const processingState = useProcessingState();

  const setFile = (file: UnlockPdfFile | null) => {
    setFileData(file);
    setPasswordState("");
    processingState.setError(null);
  };

  const setError = (error: string | null) => {
    processingState.setError(error);
  };

  const reset = () => {
    setFileData(null);
    setPasswordState("");
    processingState.setError(null);
    processingState.setIsProcessing(false);
  };

  const value: UnlockPdfContextValue = {
    fileData,
    password,
    isProcessing: processingState.isProcessing,
    error: processingState.error,
    setFile,
    setPassword: setPasswordState,
    setIsProcessing: processingState.setIsProcessing,
    setError,
    reset,
  };

  return (
    <UnlockPdfContext.Provider value={value}>
      {children}
    </UnlockPdfContext.Provider>
  );
}

export function useUnlockPdfContext(): UnlockPdfContextValue {
  const context = useContext(UnlockPdfContext);
  if (!context) {
    throw new Error("useUnlockPdfContext must be used within UnlockPdfProvider");
  }
  return context;
}
