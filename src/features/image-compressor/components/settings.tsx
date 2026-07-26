import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Slider } from "@/shared/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useImageCompressorContext } from "../context";
import { OUTPUT_FORMATS, DIMENSION_PRESETS } from "../constants";

export function ImageCompressorSettings() {
  const { settings, updateSettings } = useImageCompressorContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compression Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quality">Quality: {settings.quality}%</Label>
          <Slider
            id="quality"
            value={[settings.quality]}
            onValueChange={(value) => updateSettings({ quality: Array.isArray(value) ? value[0] : value })}
            min={1}
            max={100}
            step={1}
          />
          <p className="text-xs text-muted-foreground">Lower quality = smaller file size but reduced image quality</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="format">Output Format</Label>
          <Select
            value={settings.outputFormat}
            items={OUTPUT_FORMATS}
            onValueChange={(value) => updateSettings({ outputFormat: value as "jpeg" | "webp" })}
          >
            <SelectTrigger className="w-full" id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OUTPUT_FORMATS.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  {format.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dimension">Max Dimension</Label>
          <Select
            value={settings.maxDimension}
            items={DIMENSION_PRESETS}
            onValueChange={(value) => value && updateSettings({ maxDimension: value })}
          >
            <SelectTrigger className="w-full" id="dimension">
              <SelectValue placeholder="Select a max dimension" />
            </SelectTrigger>
            <SelectContent>
              {DIMENSION_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {settings.maxDimension === 0
              ? "Keep original dimensions"
              : `Images larger than ${settings.maxDimension}px on the longest side will be scaled down`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
