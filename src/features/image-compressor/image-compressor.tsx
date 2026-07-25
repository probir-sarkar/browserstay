import { ImageCompressorDropZone } from "./components/drop-zone";
import { ImageCompressorFileList } from "./components/file-list";
import { ImageCompressorSettings } from "./components/settings";
import { ImageCompressorActionCard } from "./components/action-card";

export function ImageCompressor() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Upload & List */}
      <div className="lg:col-span-2 space-y-6">
        <ImageCompressorDropZone />
        <ImageCompressorFileList />
      </div>

      {/* Right Column - Settings & Actions */}
      <div className="space-y-6">
        <ImageCompressorSettings />
        <ImageCompressorActionCard />
      </div>
    </div>
  );
}
