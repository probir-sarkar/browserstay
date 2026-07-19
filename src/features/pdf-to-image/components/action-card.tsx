import { useCallback } from "react";
import { ActionCard as ReusableActionCard } from "@/shared/components/layout/action-card";
import { usePdfToImageContext } from "../context";
import { PdfService } from "@/shared/services/pdf";

export function ActionCard() {
  const { file, settings, setImages, images, processing, setProcessing } = usePdfToImageContext();

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setProcessing((draft) => {
      draft.isProcessing = true;
      draft.progress = 0;
    });

    setImages([]);

    try {
      const result = await PdfService.pdfToImages(
        file.file,
        {
          scale: settings.scale,
          startPage: settings.startPage,
          endPage: settings.endPage
        },
        (current, total) => {
          // Update progress as each page is processed
          const percentage = Math.round((current / total) * 100);
          setProcessing((draft) => {
            draft.progress = percentage;
          });
        }
      );

      setImages(result);
    } catch (error) {
      console.error(error);
      // Handle error state if needed
    } finally {
      setProcessing((draft) => {
        draft.isProcessing = false;
      });
    }
  }, [file, settings, setImages, setProcessing]);

  const handleDownload = () => {
    PdfService.downloadAll(images);
  };

  if (!file && images.length === 0) return null;

  return (
    <ReusableActionCard
      isProcessing={processing.isProcessing}
      progress={processing.progress}
      onConvert={handleConvert}
      onDownload={handleDownload}
      canConvert={!!file}
      canDownload={images.length > 0}
      convertLabel="Convert to Images"
      downloadLabel="Download ZIP"
      statusMessage={
        images.length > 0 ? (
          <>
            <span className="block mb-1 opacity-90">Converted {images.length} pages successfully.</span>
            Ready to download
          </>
        ) : file ? (
          "Ready to convert PDF"
        ) : (
          "Add a PDF to start"
        )
      }
      className="bg-linear-to-br from-red-600 to-rose-700"
      buttonClassName="text-red-600 hover:bg-rose-50"
      progressClassName="bg-red-800"
      statusTextClassName="text-rose-100"
    />
  );
}
