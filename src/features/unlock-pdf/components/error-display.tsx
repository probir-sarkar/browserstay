import { useUnlockPdfContext } from "../context";
import { AlertCircle, X } from "lucide-react";

export function UnlockError() {
  const { error, setError } = useUnlockPdfContext();

  if (!error) return null;

  return (
    <div className="rounded-lg bg-destructive/10 p-4 text-destructive flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <p className="text-sm font-medium">{error}</p>
      </div>
      <button onClick={() => setError(null)} className="hover:bg-destructive/10 rounded p-1 transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
