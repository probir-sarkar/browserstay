import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Loader2, Download } from "lucide-react";
import { useImageCompressorContext } from "../context";
import { compressImage } from "../services/image-compressor";

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
      for (const imageFile of files) {
        const result = await compressImage(imageFile.file, settings);
        // Update compressed size
        updateCompressedSize(imageFile.id, result.compressedSize);

        // Download the compressed image
        const url = URL.createObjectURL(result.compressedFile);
        const link = document.createElement("a");
        link.href = url;
        const ext = result.compressedFile.type.split("/")[1];
        link.download = `${imageFile.file.name.split(".")[0]}_compressed.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
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
