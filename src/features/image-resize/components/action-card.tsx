import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { useImageResizeContext } from "../context";
import { calculateTargetDimensions } from "../services/image-resize";
import { resizeImages } from "@/shared/services";
import { downloadBlob } from "@/shared/services/download";
import { createZip } from "@/shared/services/zip";
import { getBaseName } from "@/shared/services/file";
import type { ImageFormat } from "@/shared/services/image/types";

const SUPPORTED_FORMATS: readonly string[] = ["jpeg", "png", "webp", "avif"];

function resolveOutputFormat(settingsFormat: string, mimeSubtype: string): ImageFormat {
  if (settingsFormat !== "original") return settingsFormat as ImageFormat;
  return SUPPORTED_FORMATS.includes(mimeSubtype) ? (mimeSubtype as ImageFormat) : "png";
}

export function ImageResizeActionCard() {
  const { files, settings, isResizing, setIsResizing, setError } = useImageResizeContext();

  const handleResize = async () => {
    if (files.length === 0) {
      setError("Please select at least one image to resize.");
      return;
    }

    setIsResizing(true);
    setError(null);

    try {
      const inputs = files.map((imageFile) => {
        const dimensions = calculateTargetDimensions(
          imageFile.originalWidth,
          imageFile.originalHeight,
          settings
        );

        const outputFormat = resolveOutputFormat(settings.outputFormat, imageFile.file.type.split('/')[1]);

        return {
          file: imageFile.file,
          id: imageFile.id,
          options: {
            targetWidth: dimensions.width,
            targetHeight: dimensions.height,
            quality: settings.quality,
            outputFormat,
          },
        };
      });

      const results = await resizeImages(inputs);

      if (results.length === 1) {
        const { outputFile } = results[0].result;
        const ext = outputFile.type.split("/")[1];
        const fileName = `${getBaseName(results[0].input.file)}_resized.${ext}`;
        downloadBlob(outputFile, fileName);
      } else {
        const filesMap: Record<string, File> = {};
        for (const { input, result } of results) {
          const ext = result.outputFile.type.split("/")[1];
          const baseName = `${getBaseName(input.file)}_resized`;
          let fileName = `${baseName}.${ext}`;
          let counter = 2;
          while (fileName in filesMap) {
            fileName = `${baseName}_${counter}.${ext}`;
            counter++;
          }
          filesMap[fileName] = result.outputFile;
        }
        const zipBlob = await createZip(filesMap);
        downloadBlob(zipBlob, `resized_images_${Date.now()}.zip`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while resizing images. Please try again.");
    } finally {
      setIsResizing(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Resize Images</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          Resize {files.length} image{files.length !== 1 ? 's' : ''} to {settings.width}×{settings.height}{settings.unit}.
        </p>
        {files.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {settings.maintainAspectRatio ? 'Aspect ratio will be maintained' : 'Custom dimensions'}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleResize}
          disabled={files.length === 0 || isResizing}
        >
          {isResizing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resizing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Resize & Download
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
