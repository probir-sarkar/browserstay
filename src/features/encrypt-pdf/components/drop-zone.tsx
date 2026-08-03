import { Lock } from "lucide-react";
import { useEncryptPdfContext } from "../context";
import { DropZone } from "@/shared/components/common/drop-zone";
import { createEncryptFile, ACCEPTED_FILE_TYPES } from "../constants";

export function EncryptPdfDropZone() {
  const { fileData, setFile, setError } = useEncryptPdfContext();

  const handleFile = async (file: File) => {
    try {
      setError(null);
      setFile(await createEncryptFile(file));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to read PDF. The file may be corrupt, truncated, or in an unsupported format."
      );
    }
  };

  // Hide the drop zone once a PDF has been selected
  if (fileData) return null;

  return (
    <DropZone accept={ACCEPTED_FILE_TYPES[0]} onDrop={handleFile}>
      <DropZone.Icon icon={Lock} className="text-orange-600" />
      <DropZone.Title>Drop PDF here or click to select</DropZone.Title>
      <DropZone.Description>Select a PDF file to protect with a password</DropZone.Description>
      <DropZone.Button>Select PDF</DropZone.Button>
    </DropZone>
  );
}
