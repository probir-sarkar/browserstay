import { AlertCircle, Lock } from "lucide-react";
import { useUnlockPdfContext } from "../context";
import { unlockPdf } from "@/shared/services/pdf";
import { useDownload } from "@/shared/hooks";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function UnlockActionCard() {
  const { fileData, password, setPassword, isProcessing, setIsProcessing, error, setError, reset } =
    useUnlockPdfContext();
  const { downloadFile } = useDownload();

  const handleUnlock = async () => {
    if (!fileData || !password) {
      setError(password ? "Please select a PDF file first." : "Please enter the PDF password.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await unlockPdf(fileData.file, password);
      downloadFile(result.blob, { filename: result.fileName });
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlock the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Unlock PDF</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground">
          {fileData
            ? `Enter the password for "${fileData.fileName}.pdf" to remove its protection.`
            : "Select a password-protected PDF to get started."}
        </p>
        <div className="space-y-2">
          <Label htmlFor="pdf-password">Password</Label>
          <Input
            id="pdf-password"
            type="password"
            placeholder="Enter PDF password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUnlock();
            }}
          />
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg" onClick={handleUnlock} disabled={!fileData || isProcessing}>
          {isProcessing ? "Unlocking..." : "Unlock PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
}
