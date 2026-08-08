import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { useClipboard } from "@/shared/hooks";
import { Loader2, Download, Copy, Check, RefreshCw } from "lucide-react";
import { useQRGeneratorContext } from "../context";
import { downloadPng, downloadSvg } from "../services/qr-generator";

export function QRGeneratorActionCard() {
  const { result, isProcessing, error, generateQR, reset, setError } = useQRGeneratorContext();
  const clipboard = useClipboard({ timeout: 2000 });

  const handleGenerate = async () => {
    setError(null);
    await generateQR();
  };

  const handleDownloadPng = () => {
    if (!result) return;
    downloadPng(result.png, `qrcode-${Date.now()}.png`);
  };

  const handleDownloadSvg = () => {
    if (!result) return;
    downloadSvg(result.svg, `qrcode-${Date.now()}.svg`);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Generate QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {result ? (
          <p className="text-sm text-muted-foreground">
            Ready to save. Download as PNG or SVG, or copy the vector code.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Fill in your content above, then generate your QR code.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full" size="lg" onClick={handleGenerate} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              {result ? "Regenerate" : "Generate QR Code"}
            </>
          )}
        </Button>

        {result && (
          <div className="grid w-full grid-cols-3 gap-2">
            <Button variant="outline" onClick={handleDownloadPng}>
              <Download className="h-4 w-4" />
              PNG
            </Button>
            <Button variant="outline" onClick={handleDownloadSvg}>
              <Download className="h-4 w-4" />
              SVG
            </Button>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="outline" onClick={() => clipboard.copy(result.svg)}>
                    {clipboard.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {clipboard.copied ? "Copied" : "Copy"}
                  </Button>
                }
              />
              <TooltipContent>
                <p>Copy the SVG code for use in designs</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {result && (
          <Button variant="ghost" size="sm" onClick={reset} className="w-full">
            Start Over
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
