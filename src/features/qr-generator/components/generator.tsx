import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/utils";
import { Link, Type, Mail, Phone, MessageSquare, MapPin, Wifi, User } from "lucide-react";
import { useQRGeneratorContext } from "../context";
import { WIFI_ENCRYPTION_OPTIONS } from "../constants";
import type { QRContentType, WiFiConfig } from "../types";

const CONTENT_TABS: Array<{ value: QRContentType; label: string; icon: typeof Link }> = [
  { value: "url", label: "URL", icon: Link },
  { value: "text", label: "Text", icon: Type },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "geo", label: "Location", icon: MapPin },
  { value: "wifi", label: "WiFi", icon: Wifi },
  { value: "vcard", label: "Contact", icon: User },
];

export function QRGeneratorInput() {
  const {
    contentType,
    content,
    wifiConfig,
    vcardConfig,
    smsConfig,
    geoConfig,
    setContentType,
    setContent,
    setWifiConfig,
    setVcardConfig,
    setSmsConfig,
    setGeoConfig,
  } = useQRGeneratorContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Content</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Segmented control — a full-width grid of icon buttons. Using buttons
            instead of the Tabs component avoids the fixed tab height clipping
            with many content types. */}
        <div role="tablist" aria-label="Content type" className="grid w-full grid-cols-4 sm:grid-cols-8 gap-1 p-1 rounded-lg bg-muted">
          {CONTENT_TABS.map((tab) => {
            const isActive = contentType === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setContentType(tab.value)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 rounded-md border border-transparent py-2 text-xs font-medium transition-all",
                  isActive
                    ? "bg-background text-foreground shadow-sm dark:bg-input/30 dark:border-input"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          {contentType === "url" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5 text-primary" />
                <Label htmlFor="url">Website URL</Label>
              </div>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Enter any website URL. We'll automatically add https:// if needed.
              </p>
            </div>
          )}

          {contentType === "text" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                <Label htmlFor="text">Text Content</Label>
              </div>
              <Textarea
                id="text"
                placeholder="Enter your text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Any text you want to encode in the QR code.
              </p>
            </div>
          )}

          {contentType === "email" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <Label htmlFor="email">Email Address</Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Scanning opens the user's email app with this address pre-filled.
              </p>
            </div>
          )}

          {contentType === "phone" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <Label htmlFor="phone">Phone Number</Label>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Scanning opens a call prompt with this number. Include the country code for best results.
              </p>
            </div>
          )}

          {contentType === "sms" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <Label>SMS Message</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-phone">Phone Number</Label>
                <Input
                  id="sms-phone"
                  type="tel"
                  placeholder="+1234567890"
                  value={smsConfig.phone}
                  onChange={(e) => setSmsConfig({ phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sms-message">Message</Label>
                <Textarea
                  id="sms-message"
                  placeholder="Optional pre-filled message"
                  value={smsConfig.message}
                  onChange={(e) => setSmsConfig({ message: e.target.value })}
                  rows={3}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Scanning opens the messaging app with this number and message pre-filled.
              </p>
            </div>
          )}

          {contentType === "geo" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <Label>Coordinates</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    inputMode="decimal"
                    placeholder="40.7128"
                    value={geoConfig.latitude}
                    onChange={(e) => setGeoConfig({ latitude: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    inputMode="decimal"
                    placeholder="-74.0060"
                    value={geoConfig.longitude}
                    onChange={(e) => setGeoConfig({ longitude: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Scanning opens the location in a maps app. Try Google Maps "right-click → copy coordinates".
              </p>
            </div>
          )}

          {contentType === "wifi" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                <Label>WiFi Network</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ssid">Network Name (SSID)</Label>
                <Input
                  id="ssid"
                  placeholder="MyWiFi"
                  value={wifiConfig.ssid}
                  onChange={(e) => setWifiConfig({ ssid: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="WiFi password"
                  value={wifiConfig.password}
                  onChange={(e) => setWifiConfig({ password: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="encryption">Encryption</Label>
                <Select
                  value={wifiConfig.encryption}
                  items={WIFI_ENCRYPTION_OPTIONS}
                  onValueChange={(value) => value && setWifiConfig({ encryption: value })}
                >
                  <SelectTrigger id="encryption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WIFI_ENCRYPTION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hidden">Hidden Network</Label>
                <Switch
                  id="hidden"
                  checked={wifiConfig.hidden}
                  onCheckedChange={(checked) => setWifiConfig({ hidden: checked })}
                />
              </div>
            </div>
          )}

          {contentType === "vcard" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                <Label>Contact Information</Label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={vcardConfig.firstName}
                    onChange={(e) => setVcardConfig({ firstName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={vcardConfig.lastName}
                    onChange={(e) => setVcardConfig({ lastName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vcard-phone">Phone</Label>
                  <Input
                    id="vcard-phone"
                    placeholder="+1234567890"
                    value={vcardConfig.phone}
                    onChange={(e) => setVcardConfig({ phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vcard-email">Email</Label>
                  <Input
                    id="vcard-email"
                    type="email"
                    placeholder="john@example.com"
                    value={vcardConfig.email}
                    onChange={(e) => setVcardConfig({ email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vcard-organization">Organization</Label>
                <Input
                  id="vcard-organization"
                  placeholder="Company Name"
                  value={vcardConfig.organization}
                  onChange={(e) => setVcardConfig({ organization: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vcard-website">Website</Label>
                <Input
                  id="vcard-website"
                  type="url"
                  placeholder="https://example.com"
                  value={vcardConfig.website}
                  onChange={(e) => setVcardConfig({ website: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
