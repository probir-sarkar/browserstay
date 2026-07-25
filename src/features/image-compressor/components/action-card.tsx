import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { useImageCompressorContext } from "../context";
import { compressImages } from "@/shared/services";
import { createZip } from "@/shared/services/zip";
import { downloadBlob } from "@/shared/services/download";
import { getBaseName } from "@/shared/services/file";

export function ImageCompressorActionCard() {
  const { files, settings, isCompressing, setIsCompressing, setError, updateCompressedSize } =
    useImageCompressorContext();

  const handleCompress = async () => {
    if (files.length === 0) {
      setError("Please select at least one image to compress.");
      return;
    }

    setIsCompressing(true);
    setError(null);

    try {
      // Compress all images with controlled concurrency
      const inputs = files.map((imageFile) => ({
        file: imageFile.file,
        settings,
        id: imageFile.id
      }));

      const results = await compressImages(inputs);

      // Build compressed files map
      const compressedFiles: Record<string, File> = {};
      for (const { input, result } of results) {
        // Update compressed size for each file
        if (input.id) {
          updateCompressedSize(input.id, result.compressedSize);
        }
        const ext = result.compressedFile.type.split("/")[1];
        const baseName = `${getBaseName(input.file)}_compressed`;
        let fileName = `${baseName}.${ext}`;
        let counter = 2;
        while (fileName in compressedFiles) {
          fileName = `${baseName}_${counter}.${ext}`;
          counter++;
        }
        compressedFiles[`${input.id}_${fileName}`] = result.compressedFile;
      }


      if (files.length === 1) {
        const [[fileName, file]] = Object.entries(compressedFiles);
        downloadBlob(file, fileName);
      } else {
        const zipBlob = await createZip(compressedFiles);
        downloadBlob(zipBlob, `compressed_images_${Date.now()}.zip`);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while compressing images. Please try again.");
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Compress Images</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground mb-4">
          Compress {files.length} image{files.length !== 1 ? "s" : ""} to reduce file size while maintaining quality.
        </p>
        {files.length > 0 && <div className="text-xs text-muted-foreground">Target quality: {settings.quality}%</div>}
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleCompress} disabled={files.length === 0 || isCompressing}>
          {isCompressing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Compressing...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Compress & Download
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
