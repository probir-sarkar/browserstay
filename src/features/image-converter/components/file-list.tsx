import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Trash2 } from "lucide-react";
import prettyBytes from "pretty-bytes";
import { useImageConverterContext } from "../context";

export function ImageConverterFileList() {
  const { files, removeFile } = useImageConverterContext();

  if (files.length === 0) return null;

  return (
    <div className="space-y-3">
      {files.map((file) => {
        const ratio = file.conversionRatio;
        const smaller = typeof ratio === "number" && ratio > 0;

        return (
          <Card key={file.id} className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={file.preview}
                alt={file.file.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-foreground truncate">{file.file.name}</p>
                  {typeof ratio === "number" && ratio !== 0 && (
                    <Badge variant={smaller ? "secondary" : "outline"} className="text-xs">
                      {smaller ? `-${ratio.toFixed(1)}%` : `+${Math.abs(ratio).toFixed(1)}%`}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{prettyBytes(file.originalSize)}</span>
                  {file.convertedSize !== undefined && (
                    <>
                      <span>→</span>
                      <span className="text-primary font-medium">
                        {prettyBytes(file.convertedSize)}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
