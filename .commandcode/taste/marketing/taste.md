# Marketing & Product Positioning

- Prefers marketing that targets the general public in plain, non-technical language rather than developer/tech-enthusiast audiences. Confidence: 0.9
- Wants privacy to be the central selling point: "no EU, no USA, no China — only on your PC," no uploads, no servers, files never leave the device. Confidence: 0.9
- Wants "free" and "open source" promoted as headline pillars of the product, not buried details. Confidence: 0.8
- Wants WASM/on-device processing framed as a credibility/quality differentiator behind the privacy headline in marketing copy. Confidence: 0.7
- Values a distinct, brandable product name with a matching available `.com` domain over a generic existing name, for SEO winnability. Confidence: 0.8
- Cares about SEO infrastructure correctness: sitemap/robots/canonical/OG URLs pointing at the real production domain, a real og-image, and structured data (JSON-LD). Confidence: 0.7
- Removes off-brand content (e.g., partner/promo banners like "Quiz Zone") from marketing pages because it undermines trust for a privacy-focused brand. Confidence: 0.6
- Wants visual/brand assets (e.g., the OG image) to use the brand theme color (#1db6a5 teal) so marketing materials match the site's color scheme instead of arbitrary placeholder colors. Confidence: 0.7
- Wants marketing/product claims to be technically accurate — avoids overstating capability (e.g., removing "100% offline / works offline" copy when no service worker exists, replacing it with accurate "local processing" wording) rather than promising features that aren't implemented. Claims must match the implementation at a granular level (e.g., also removing a "work continues if your connection drops" line because WASM/worker assets load lazily and can't be guaranteed after connectivity loss). Confidence: 0.85
