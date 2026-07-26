import { useState, useCallback, useEffect, useRef, type SetStateAction } from "react";

export interface BaseFile {
  id: string;
  file: File;
}

export interface FileHandlerOptions<T extends BaseFile> {
  validateFile?: (file: File) => boolean;
  createFile?: (file: File) => T;
  onAdd?: (files: T[]) => void;
  onRemove?: (id: string) => void;
}

export function useFileHandler<T extends BaseFile = BaseFile>(
  options: FileHandlerOptions<T> = {}
) {
  const [files, setFiles] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const filesRef = useRef<T[]>(files);
  filesRef.current = files;

  useEffect(() => {
    return () => {
      filesRef.current.forEach((f) => {
        if ('preview' in f && typeof f.preview === 'string') {
          URL.revokeObjectURL(f.preview as string);
        }
      });
    };
  }, []);

  const { validateFile, createFile, onAdd, onRemove } = options;

  const addFiles = useCallback(
    (newFiles: File[]) => {
      const processedFiles: T[] = [];

      newFiles.forEach((file) => {
        if (validateFile && !validateFile(file)) return;

        const baseFile: BaseFile = {
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
          file,
        };

        const fileEntry = createFile ? createFile(file) : (baseFile as T);
        processedFiles.push(fileEntry);
      });

      setFiles((prev) => {
        const uniqueFiles = processedFiles.filter(
          (newFile) => !prev.some((f) => f.file.name === newFile.file.name && f.file.size === newFile.file.size)
        );
        return [...prev, ...uniqueFiles];
      });

      setError(null);
      onAdd?.(processedFiles);
    },
    [validateFile, createFile, onAdd]
  );

  const removeFile = useCallback(
    (id: string) => {
      setFiles((prev) => {
        const file = prev.find((f) => f.id === id);
        if (file && 'preview' in file && typeof file.preview === 'string') {
          URL.revokeObjectURL(file.preview as string);
        }
        const filtered = prev.filter((f) => f.id !== id);
        onRemove?.(id);
        return filtered;
      });
    },
    [onRemove]
  );

  const clearFiles = useCallback(() => {
    files.forEach((f) => {
      if ('preview' in f && typeof f.preview === 'string') {
        URL.revokeObjectURL(f.preview as string);
      }
    });
    setFiles([]);
  }, [files]);

  const setFilesHandler = useCallback((newFiles: SetStateAction<T[]>) => {
    setFiles(newFiles);
  }, []);

  return {
    files,
    error,
    setError,
    addFiles,
    removeFile,
    clearFiles,
    setFiles: setFilesHandler,
  };
}
