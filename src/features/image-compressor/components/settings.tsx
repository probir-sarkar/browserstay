import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Slider } from "@/shared/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useImageCompressorContext } from "../context";

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
            value={settings.quality}
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
            onValueChange={(value) => value && updateSettings({ outputFormat: value })}
          >
            <SelectTrigger className="w-full" id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG (Best compression)</SelectItem>
              <SelectItem value="webp">WebP (Modern format)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
