import prettyBytes from "pretty-bytes";
import { FileText, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useUnlockPdfContext } from "../context";

export function UnlockFileDetails() {
  const { fileData, reset } = useUnlockPdfContext();

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
    </div>
  );
}
