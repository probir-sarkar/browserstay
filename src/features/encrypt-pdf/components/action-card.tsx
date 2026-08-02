import { useState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { useEncryptPdfContext } from "../context";
import { encryptPdf } from "../services/encrypt-pdf";
import { useDownload } from "@/shared/hooks";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function EncryptActionCard() {
  const { fileData, isProcessing, setIsProcessing, error, setError, reset } = useEncryptPdfContext();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const { downloadFile } = useDownload();

  const handleEncrypt = async () => {
    if (!fileData || !password) {
      setError(password ? "Please select a PDF file first." : "Please enter a password.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await encryptPdf(fileData.file, password);
      downloadFile(result.blob, { filename: result.fileName });
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to encrypt the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const clearErrorOnType = () => {
    if (error) setError(null);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Protect PDF</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground">
          {fileData
            ? `Set a password for "${fileData.fileName}.pdf" to protect it.`
            : "Select a PDF to protect with a password."}
        </p>
        <div className="space-y-2">
          <Label htmlFor="pdf-password">Password</Label>
          <Input
            id="pdf-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearErrorOnType();
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdf-confirm">Confirm Password</Label>
          <Input
            id="pdf-confirm"
            type="password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              clearErrorOnType();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEncrypt();
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
        <Button className="w-full" size="lg" onClick={handleEncrypt} disabled={!fileData || isProcessing}>
          {isProcessing ? "Encrypting..." : "Encrypt PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
}
