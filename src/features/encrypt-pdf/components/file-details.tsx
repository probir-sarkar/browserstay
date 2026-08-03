import { AlertTriangle, FileText, X } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useEncryptPdfContext } from "../context";

export function EncryptFileDetails() {
  const { fileData, reset } = useEncryptPdfContext();

  if (!fileData) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Selected File</h3>
      <Card className="flex flex-row items-center p-4 gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600">
          <FileText className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate font-medium text-foreground">{fileData.fileName}.pdf</p>
          <p className="text-sm text-muted-foreground">{prettyBytes(fileData.fileSize)}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-destructive shrink-0"
          onClick={reset}
        >
          <X className="h-5 w-5" />
        </Button>
      </Card>
      {fileData.isEncrypted && (
        <p className="flex items-start gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          This PDF is already password-protected and cannot be re-encrypted. Use the Unlock PDF tool first if you want to change its password.
        </p>
      )}
    </div>
  );
}
