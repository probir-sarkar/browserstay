import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { useImageConverterContext } from "../context";
import { encodeImages } from "@/shared/services";
import type { ImageFormat } from "@/shared/services";
import { createZip } from "@/shared/services/zip";
import { downloadBlob } from "@/shared/services/download";
import { getBaseName } from "@/shared/services/file";

const FORMAT_EXTENSION: Record<ImageFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
  avif: "avif",
};

export function ImageConverterActionCard() {
  const { files, settings, isConverting, setIsConverting, setError, updateConvertedSize } =
    useImageConverterContext();

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please select at least one image to convert.");
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const inputs = files.map((imageFile) => ({
        file: imageFile.file,
        options: settings,
        id: imageFile.id,
      }));

      const results = await encodeImages(inputs);

      const convertedFiles: Record<string, File> = {};
      const ext = FORMAT_EXTENSION[settings.outputFormat];
      for (const { input, result } of results) {
        if (input.id) {
          updateConvertedSize(input.id, result.outputSize);
        }
        const baseName = `${getBaseName(input.file)}_converted`;
        let fileName = `${baseName}.${ext}`;
        let counter = 2;
        while (fileName in convertedFiles) {
          fileName = `${baseName}_${counter}.${ext}`;
          counter++;
        }
        convertedFiles[fileName] = result.outputFile;
      }

      if (files.length === 1) {
        const [[fileName, file]] = Object.entries(convertedFiles);
        downloadBlob(file, fileName);
      } else {
        const zipBlob = await createZip(convertedFiles);
        downloadBlob(zipBlob, `converted_images_${Date.now()}.zip`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while converting images. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Convert Images</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          Convert {files.length} image{files.length !== 1 ? "s" : ""} to{" "}
          {settings.outputFormat.toUpperCase()} using high-quality WebAssembly encoding.
        </p>
        {files.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Target quality: {settings.outputFormat === "png" ? "lossless" : `${settings.quality}%`}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          onClick={handleConvert}
          disabled={files.length === 0 || isConverting}
        >
          {isConverting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Convert & Download
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
