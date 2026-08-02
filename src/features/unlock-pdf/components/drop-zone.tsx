import { Lock } from "lucide-react";
import { useUnlockPdfContext } from "../context";
import { DropZone } from "@/shared/components/common/drop-zone";
import { createUnlockFile, ACCEPTED_FILE_TYPES } from "../constants";

export function UnlockPdfDropZone() {
  const { setFile } = useUnlockPdfContext();

  const handleFile = (file: File) => {
    setFile(createUnlockFile(file));
  };

  return (
    <DropZone
      accept={ACCEPTED_FILE_TYPES[0]}
      onDrop={handleFile}
    >
      <DropZone.Icon icon={Lock} className="text-orange-600" />
      <DropZone.Title>Drop PDF here or click to select</DropZone.Title>
      <DropZone.Description>Select a password-protected PDF file to unlock</DropZone.Description>
      <DropZone.Button>Select PDF</DropZone.Button>
    </DropZone>
  );
}
