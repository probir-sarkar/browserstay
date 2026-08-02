import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useMergePdfContext } from "../context";
import { Loader2, Download } from "lucide-react";

export function MergeActionCard() {
  const { files, settings, isMerging, setIsMerging, setError } = useMergePdfContext();

  const [success, setSuccess] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setError(null);
    setSuccess(false);

    try {
      // Dynamic import to reduce initial bundle size
      const { PDFDocument } = await import("@cantoo/pdf-lib");

      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = settings.outputFileName || "merged.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("An error occurred while merging PDFs. Please check if the files are valid/protected.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Merge PDFs</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          Combine {files.length} file{files.length !== 1 ? "s" : ""} into a single PDF document.
        </p>
        {files.length > 0 && (
          <div className="text-xs text-muted-foreground">Ready to merge {files.length} documents.</div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleMerge} disabled={files.length < 2 || isMerging}>
          {isMerging ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Merging...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Merge PDFs
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
