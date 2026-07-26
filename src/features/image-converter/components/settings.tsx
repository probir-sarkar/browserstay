import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Slider } from "@/shared/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useImageConverterContext } from "../context";
import { OUTPUT_FORMATS, QUALITY_RANGE } from "../constants";
import type { ImageFormat } from "@/shared/services";

export function ImageConverterSettings() {
  const { settings, updateSettings } = useImageConverterContext();
  const qualityAffectsOutput = settings.outputFormat !== "png";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">Output Format</Label>
          <Select
            value={settings.outputFormat}
            onValueChange={(value) => updateSettings({ outputFormat: value as ImageFormat })}
          >
            <SelectTrigger className="w-full" id="format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OUTPUT_FORMATS.map((format) => (
                <SelectItem key={format.value} value={format.value}>
                  <span className="font-medium">{format.label}</span>
                  <span className="text-muted-foreground"> — {format.desc}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quality">Quality: {settings.quality}%</Label>
          <Slider
            id="quality"
            value={[settings.quality]}
            onValueChange={(value) =>
              updateSettings({ quality: Array.isArray(value) ? value[0] : value })
            }
            min={QUALITY_RANGE.min}
            max={QUALITY_RANGE.max}
            step={QUALITY_RANGE.step}
            disabled={!qualityAffectsOutput}
          />
          <p className="text-xs text-muted-foreground">
            {qualityAffectsOutput
              ? "Lower quality = smaller file size. Default 100% keeps best quality."
              : "PNG is lossless — quality has no effect."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
