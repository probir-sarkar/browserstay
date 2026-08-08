import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, QrCode } from "lucide-react";
import { useQRGeneratorContext } from "../context";

export function QRGeneratorPreview() {
  const { result, isProcessing } = useQRGeneratorContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="flex flex-col items-center justify-center gap-3 py-2">
            <div
              className="flex items-center justify-center p-3 rounded-lg border-2 border-border"
              style={{ backgroundColor: "white", width: "min(100%, 260px)" }}
            >
              <img
                src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(result.svg)}`}
                alt="Generated QR Code"
                className="block"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Live preview — downloads below.
            </p>
          </div>
        ) : isProcessing ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating QR code...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <QrCode className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Your QR code will appear here. Fill in the content and press generate.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
