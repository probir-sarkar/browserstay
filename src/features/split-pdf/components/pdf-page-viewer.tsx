import { Document, Page, pdfjs } from "react-pdf";
import { FileText } from "lucide-react";
import { useSplitPdfContext } from "../context";
import { Button } from "@/shared/components/ui/button";
import { CheckSquare, Square } from "lucide-react";
import { cn } from "@/shared/utils";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

interface PageThumbnailProps {
  file: File;
  pageNumber: number;
  selected: boolean;
  onClick: () => void;
}

function PageThumbnail({ file, pageNumber, selected, onClick }: PageThumbnailProps) {
  return (
    <div
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-lg border transition-all",
        "bg-muted/30 hover:ring-2 hover:ring-primary/50",
        selected && "ring-2 ring-primary bg-primary/5"
      )}
      onClick={onClick}
      style={{ minHeight: "240px" }}
    >
      {selected && <div className="absolute inset-0 bg-primary/10 pointer-events-none" />}

      <div
        className={cn(
          "absolute left-2 top-2 z-20 rounded px-2 py-1 text-xs font-medium backdrop-blur-sm",
          selected ? "bg-primary text-primary-foreground" : "bg-background/80 text-foreground"
        )}
      >
        {pageNumber}
      </div>

      <div
        className={cn(
          "absolute right-2 top-2 z-20 rounded-full p-1.5 backdrop-blur-sm transition-all",
          selected
            ? "bg-primary text-primary-foreground scale-100"
            : "bg-background/80 text-muted-foreground scale-0 group-hover:scale-100"
        )}
      >
        <FileText className="h-3 w-3" />
      </div>

      <div className="flex h-full w-full items-center justify-center p-3">
        <Document file={file}>
          <Page
            pageNumber={pageNumber}
            width={180}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            loading={<FileText className="h-8 w-8 text-muted-foreground/50 animate-pulse" />}
            error={<FileText className="h-8 w-8 text-muted-foreground/50" />}
            className="max-w-full max-h-full object-contain"
          />
        </Document>
      </div>
    </div>
  );
}

export function PdfPageViewer() {
  const { fileData, selectedPages, togglePageSelection, selectAllPages, deselectAllPages } = useSplitPdfContext();

  if (!fileData) return null;

  const isAllSelected = selectedPages.length === fileData.pageCount;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Pages ({selectedPages.length} selected)</h3>
        <Button
          variant={isAllSelected ? "default" : "outline"}
          size="sm"
          onClick={isAllSelected ? deselectAllPages : selectAllPages}
          className="gap-2"
        >
          {isAllSelected ? <Square className="h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
          {isAllSelected ? "None" : "All"}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {Array.from({ length: fileData.pageCount }, (_, i) => i + 1).map((pageNum) => (
          <PageThumbnail
            key={pageNum}
            file={fileData.file}
            pageNumber={pageNum}
            selected={selectedPages.includes(pageNum)}
            onClick={() => togglePageSelection(pageNum)}
          />
        ))}
      </div>
    </div>
  );
}
