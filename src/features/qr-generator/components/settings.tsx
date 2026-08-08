import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/shared/components/ui/separator";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils";
import { useQRGeneratorContext } from "../context";
import { COLOR_OPTIONS, ERROR_CORRECTION_OPTIONS, MARGIN_OPTIONS, SIZE_OPTIONS } from "../constants";

export function QRGeneratorSettings() {
  const { settings, updateSettings } = useQRGeneratorContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size">Size</Label>
            <Select
              value={settings.size}
              items={SIZE_OPTIONS}
              onValueChange={(value) => value && updateSettings({ size: value })}
            >
              <SelectTrigger id="size" className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Larger sizes print better. Use 512px+ for posters.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="margin">Quiet Zone</Label>
            <Select
              value={settings.margin}
              items={MARGIN_OPTIONS}
              onValueChange={(value) => value != null && updateSettings({ margin: value })}
            >
              <SelectTrigger id="margin" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARGIN_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Empty space around the code helps scanners find it.</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>Foreground Color</Label>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_OPTIONS.map((option) => {
              const isActive = settings.color === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-label={`${option.label}${isActive ? " (selected)" : ""}`}
                  aria-pressed={isActive}
                  onClick={() => updateSettings({ color: option.value })}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-lg border transition-all",
                    isActive ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
                  )}
                >
                  {option.value === "custom" ? (
                    <span className="text-xs text-muted-foreground">{settings.customColor || "#000"}</span>
                  ) : (
                    <span className="h-6 w-6 rounded-md" style={{ backgroundColor: option.hex }} />
                  )}
                  {isActive && <Check className="ml-1 h-3.5 w-3.5 text-primary" />}
                </button>
              );
            })}
          </div>

          {settings.color === "custom" && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="customColor">Custom Color</Label>
              <div className="flex gap-2">
                <Input
                  id="customColor"
                  type="color"
                  value={settings.customColor || "#000000"}
                  onChange={(e) => updateSettings({ customColor: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.customColor || "#000000"}
                  onChange={(e) => updateSettings({ customColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="error">Error Correction Level</Label>
            <Select
              value={settings.errorCorrectionLevel}
              items={ERROR_CORRECTION_OPTIONS}
              onValueChange={(value) => value && updateSettings({ errorCorrectionLevel: value })}
            >
              <SelectTrigger id="error" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ERROR_CORRECTION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="font-medium">{option.label}</span>
                    <span className="text-muted-foreground"> — {option.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Higher levels survive damage but produce denser codes.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bgColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="bgColor"
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={settings.backgroundColor}
                onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
                placeholder="#FFFFFF"
                className="flex-1"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <Label htmlFor="transparent">Transparent Background</Label>
              <Switch
                id="transparent"
                checked={settings.transparent}
                onCheckedChange={(checked) => updateSettings({ transparent: checked })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
