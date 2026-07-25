import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from "react";
import { arrayMove } from "@dnd-kit/helpers";
import type { ImageItem, ImageToPdfSettings } from "./types";
import { DEFAULT_IMAGE_TO_PDF_SETTINGS } from "./constants";
import { createImageItem } from "./services/image-to-pdf";

interface ImageToPdfContextValue {
  images: ImageItem[];
  settings: ImageToPdfSettings;
  isProcessing: boolean;
  error: string | null;
  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  reorderImages: (activeId: string, overId: string) => void;
  updateSettings: (settings: Partial<ImageToPdfSettings>) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const ImageToPdfContext = createContext<ImageToPdfContextValue | null>(null);

export function ImageToPdfProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [settings, setSettings] = useState<ImageToPdfSettings>(DEFAULT_IMAGE_TO_PDF_SETTINGS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    };
  }, [images]);

  const addImages = useCallback(async (files: File[]) => {
    const newImages: ImageItem[] = [];

    for (const file of files) {
      try {
        const imageItem = await createImageItem(file);
        newImages.push(imageItem);
      } catch (err) {
        setError(`Failed to load image: ${file.name}`);
        console.error(err);
      }
    }

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((i) => i.id === id);
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const reorderImages = useCallback((activeId: string, overId: string) => {
    setImages((prev) => {
      const oldIndex = prev.findIndex((i) => i.id === activeId);
      const newIndex = prev.findIndex((i) => i.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ImageToPdfSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const reset = useCallback(() => {
    images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setImages([]);
    setIsProcessing(false);
    setError(null);
    setSettings(DEFAULT_IMAGE_TO_PDF_SETTINGS);
  }, [images]);

  const value: ImageToPdfContextValue = {
    images,
    settings,
    isProcessing,
    error,
    addImages,
    removeImage,
    reorderImages,
    updateSettings,
    setIsProcessing,
    setError,
    reset,
  };

  return (
    <ImageToPdfContext.Provider value={value}>
      {children}
    </ImageToPdfContext.Provider>
  );
}

export function useImageToPdfContext(): ImageToPdfContextValue {
  const context = useContext(ImageToPdfContext);
  if (!context) {
    throw new Error("useImageToPdfContext must be used within ImageToPdfProvider");
  }
  return context;
}
