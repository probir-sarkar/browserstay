import { ImageConverterDropZone } from "./components/drop-zone";
import { ImageConverterFileList } from "./components/file-list";
import { ImageConverterSettings } from "./components/settings";
import { ImageConverterActionCard } from "./components/action-card";

export function ImageConverter() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Upload & List */}
      <div className="lg:col-span-2 space-y-6">
        <ImageConverterDropZone />
        <ImageConverterFileList />
      </div>

      {/* Right Column - Settings & Actions */}
      <div className="space-y-6">
        <ImageConverterSettings />
        <ImageConverterActionCard />
      </div>
    </div>
  );
}
