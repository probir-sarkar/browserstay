import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { useSplitPdfContext } from "../context";
import type { SplitMode } from "../types";
import { extractPages, splitAllPages } from "../services/split-pdf";
import { Info, Download, Scissors, Loader2 } from "lucide-react";
import { createZip } from "@/shared/services/zip";
import { downloadBlob } from "@/shared/services/download";

export function SplitControls() {
  const { fileData, settings, selectedPages, isProcessing, setIsProcessing, setError, updateSettings } =
    useSplitPdfContext();

  const handleSplit = async () => {
    if (!fileData) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (settings.splitMode === "extract") {
        if (selectedPages.length === 0) {
          setError("Please select at least one page.");
          setIsProcessing(false);
          return;
        }

        const indices = selectedPages.map((p) => p - 1);
        const blob = await extractPages(fileData.file, indices);
        downloadBlob(blob, `${fileData.fileName}-extracted.pdf`);
      } else {
        const files = await splitAllPages(fileData.file, fileData.pageCount, fileData.fileName);
        const zipBlob = await createZip(files);
        downloadBlob(zipBlob, `${fileData.fileName}-split.zip`);
      }
    } catch {
      setError("An error occurred while splitting the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = !fileData || isProcessing || (settings.splitMode === "extract" && selectedPages.length === 0);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Split Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        <RadioGroup
          value={settings.splitMode}
          onValueChange={(val) => updateSettings({ splitMode: val as SplitMode })}
          className="grid gap-4"
          disabled={!fileData}
        >
          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="extract" id="extract" className="mt-1" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="extract" className="font-medium cursor-pointer">
                Extract pages
              </Label>
              <p className="text-sm text-muted-foreground">Create a new PDF containing only the selected pages.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="split-all" id="split-all" className="mt-1" />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="split-all" className="font-medium cursor-pointer">
                Split all pages
              </Label>
              <p className="text-sm text-muted-foreground">
                Save every page as a separate PDF file (downloaded as a ZIP).
              </p>
            </div>
          </div>
        </RadioGroup>

        {fileData && settings.splitMode === "extract" && (
          <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                Total pages: <strong>{fileData.pageCount}</strong> • Selected: <strong>{selectedPages.length}</strong>
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleSplit} disabled={isDisabled}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {settings.splitMode === "extract" ? (
                <Download className="mr-2 h-4 w-4" />
              ) : (
                <Scissors className="mr-2 h-4 w-4" />
              )}
              {settings.splitMode === "extract" ? "Download PDF" : "Split & Download ZIP"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
