import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header";
import { HowItWorks } from "@/shared/components/layout/how-it-works";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { QRGenerator } from "@/features/qr-generator/qr-generator";
import { QRGeneratorProvider } from "@/features/qr-generator";
import { generateMetaFromKey } from "@/lib/seo";

const qrGeneratorFaqItems = [
  {
    question: "What can I create QR codes for?",
    answer:
      "URLs, plain text, email addresses, phone numbers, SMS messages, map coordinates, WiFi credentials, and contact information (vCards). Each type opens the right app on the scanner's phone.",
  },
  {
    question: "What is the difference between PNG and SVG?",
    answer:
      "PNG is a raster image — great for sharing and printing at a fixed size. SVG is a vector format that scales to any size without losing quality, which makes it ideal for logos, print design, and other professional uses.",
  },
  {
    question: "What size should my QR code be?",
    answer:
      "For digital use, 256-384px is usually plenty. For print materials, 512px or larger is recommended. Larger QR codes are easier to scan from a distance. You can also download as SVG to get a resolution-independent file.",
  },
  {
    question: "What is error correction level?",
    answer:
      "Error correction lets QR codes be scanned even if partially damaged or obscured. Higher levels (H, Q) recover more data but produce larger codes. Medium (M) is a good default; High (H) is best for print where codes may get scratched.",
  },
  {
    question: "Can I customize the colors and background?",
    answer:
      "Yes. Pick from preset foreground colors or set any custom hex color, and choose a background color — including a transparent background for placing the QR code on top of your own designs. Keep the contrast high so scanners can read it.",
  },
  {
    question: "What is the quiet zone?",
    answer:
      "The quiet zone is the empty border around the QR code that helps scanners locate it. A standard 4-module border is safest, but you can reduce it when space is tight.",
  },
  {
    question: "Are these QR codes free to use?",
    answer:
      "Yes! All QR codes are generated entirely in your browser — nothing is uploaded to a server. They're free for personal and commercial use with no watermarks, limits, or expiration dates.",
  },
];

export const Route = createFileRoute("/qr-generator")({
  component: QRGeneratorPage,
  head: () => generateMetaFromKey("qrGenerator"),
});

function QRGeneratorPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="QR Code Generator"
          subtitle="Create custom QR codes for URLs, text, email, phone, WiFi, locations, and more. Customize colors, sizes, and error correction. 100% free, private, and generated in your browser."
        />

        <QRGeneratorProvider>
          <QRGenerator />
        </QRGeneratorProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Choose Content Type",
                description: "Pick what your QR code should do — open a URL, join WiFi, call a number, and more.",
              },
              {
                title: "Customize Appearance",
                description: "Set the size, colors, error correction, and quiet zone to match your brand.",
              },
              {
                title: "Generate & Download",
                description: "Get a crisp PNG or scalable SVG, or copy the code directly for your designs.",
              }
            ]}
            description="Create professional QR codes in three simple steps. Fast, secure, and purely client-side."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={qrGeneratorFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  );
}
