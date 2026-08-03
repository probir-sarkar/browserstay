import { useState } from "react";
import { AlertCircle, Check, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useEncryptPdfContext } from "../context";
import { encryptPdf } from "@/shared/services/pdf";
import { generatePassword, calculateStrength, getPasswordStrength, STRENGTH_COLORS } from "@/features/password-generator/services/password-generator";
import { DEFAULT_PASSWORD_OPTIONS } from "@/features/password-generator/constants";
import { useDownload, useClipboard } from "@/shared/hooks";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/utils";

interface IconButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string | false;
  children: React.ReactNode;
}

function IconButton({ label, onClick, disabled, className, children }: IconButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={cn("h-6 w-6 text-muted-foreground hover:text-foreground", className)}
          >
            {children}
          </Button>
        }
      />
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function EncryptActionCard() {
  const { fileData, isProcessing, setIsProcessing, error, setError, reset } = useEncryptPdfContext();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { downloadFile } = useDownload();
  const clipboard = useClipboard({ timeout: 2000 });

  const strength = getPasswordStrength(calculateStrength(password));
  const passwordsMatch = password.length > 0 && password === confirm;
  const canEncrypt = !!fileData && !fileData.isEncrypted && passwordsMatch && !isProcessing;

  const handleEncrypt = async () => {
    if (!fileData || !password) {
      setError(password ? "Please select a PDF file first." : "Please enter a password.");
      return;
    }
    if (fileData.isEncrypted) {
      setError("This PDF is already password-protected and cannot be re-encrypted.");
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

  const handleGeneratePassword = () => {
    const generated = generatePassword({ ...DEFAULT_PASSWORD_OPTIONS });
    setPassword(generated);
    setConfirm(generated);
    if (error) setError(null);
  };

  const clearErrorOnType = () => {
    if (error) setError(null);
  };

  const strengthColor = () => {
    if (strength.score < 40) return STRENGTH_COLORS.weak;
    if (strength.score < 70) return STRENGTH_COLORS.medium;
    return STRENGTH_COLORS.strong;
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
          <div className="flex items-center justify-between">
            <Label htmlFor="pdf-password">Password</Label>
            <div className="flex items-center gap-0.5">
              <IconButton label="Generate a strong password" onClick={handleGeneratePassword}>
                <RefreshCw className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                label={clipboard.copied ? "Copied!" : "Copy password"}
                onClick={() => clipboard.copy(password)}
                disabled={!password}
                className={clipboard.copied && "text-green-600"}
              >
                {clipboard.copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </IconButton>
            </div>
          </div>
          <div className="relative">
            <Input
              id="pdf-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearErrorOnType();
              }}
              className="pr-10"
            />
            {password && (
              <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <IconButton
                  label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </IconButton>
              </div>
            )}
          </div>
          {password && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className={cn("font-medium", strength.color)}>
                  {strength.label} password
                </span>
                <span className="text-muted-foreground">{strength.score}%</span>
              </div>
              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-300 ease-out", strengthColor())}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pdf-confirm">Confirm Password</Label>
          <Input
            id="pdf-confirm"
            type={showPassword ? "text" : "password"}
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
        <Button className="w-full" size="lg" onClick={handleEncrypt} disabled={!canEncrypt}>
          {isProcessing ? "Encrypting..." : "Encrypt PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
}
