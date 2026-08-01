
import { ShieldCheck, Lock, Zap, Globe } from "lucide-react";
import { cn } from "@/shared/utils";
import { GithubIcon } from "@/shared/components/common";

type Props = { className?: string };

const items = [
  { icon: ShieldCheck, label: "100% local processing" },
  { icon: Lock, label: "No uploads, no tracking" },
  { icon: Zap, label: "In-browser rendering" },
  { icon: Globe, label: "No servers, anywhere" },
  { icon: GithubIcon, label: "Open source" }
];

export function TrustBar({ className }: Props) {
  return (
    <div className={cn("inline-flex rounded-lg border bg-card px-4 py-3 mx-auto shadow-xs", className)}>
      <ul className="flex flex-wrap justify-center items-center text-xs text-muted-foreground gap-x-6 gap-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="font-medium text-foreground">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
