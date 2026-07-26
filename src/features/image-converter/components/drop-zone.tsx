import { useCallback } from "react";
import { Upload } from "lucide-react";
import { useImageConverterContext } from "../context";

export function ImageConverterDropZone() {
  const { addFiles } = useImageConverterContext();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    },
    [addFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        addFiles(files);
      }
    },
    [addFiles]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="image-converter-input"
      />
      <label htmlFor="image-converter-input" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground mb-2">
              Drop your images here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse • JPG, PNG, WebP, AVIF, GIF supported
            </p>
          </div>
        </div>
      </label>
    </div>
  );
}
