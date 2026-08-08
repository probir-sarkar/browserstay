import { QRGeneratorInput } from "./components/generator";
import { QRGeneratorSettings } from "./components/settings";
import { QRGeneratorPreview } from "./components/preview";
import { QRGeneratorActionCard } from "./components/action-card";

export function QRGenerator() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column — content entry + settings */}
      <div className="lg:col-span-2 space-y-6">
        <QRGeneratorInput />
        <QRGeneratorSettings />
      </div>

      {/* Right column — live preview + generate/download */}
      <div className="space-y-6">
        <QRGeneratorPreview />
        <QRGeneratorActionCard />
      </div>
    </div>
  );
}
