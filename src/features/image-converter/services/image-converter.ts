import type { ConverterFile } from "../types";

export function createConverterFile(file: File): ConverterFile {
  const preview = URL.createObjectURL(file);
  return {
    id: `${file.name}-${file.size}-${Date.now()}`,
    file,
    preview,
    originalSize: file.size,
  };
}
