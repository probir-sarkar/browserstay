import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { QRGenerator } from "@/features/qr-generator/qr-generator"
import { QRGeneratorProvider } from "@/features/qr-generator"
import { BASE_URL } from "@/lib/seo"

const qrGeneratorFaqItems = [
  {
    question: "What can I create QR codes for?",
    answer: "You can create QR codes for website URLs, plain text, WiFi network credentials, and contact information (vCards). Each type serves a different purpose - URLs for websites, WiFi for easy network sharing, and vCards for sharing contacts."
  },
  {
    question: "What size should my QR code be?",
    answer: "For print materials, 300-400px is recommended. For digital use, 200-300px is sufficient. Larger QR codes are easier to scan from a distance. Our generator allows sizes from 200-600px."
  },
  {
    question: "What is error correction level?",
    answer: "Error correction allows QR codes to be scanned even if partially damaged or obscured. Higher levels (H, Q) can recover more data but result in larger QR codes. Medium (M) is recommended for most use cases."
  },
  {
    question: "Can I customize QR code colors?",
    answer: "Yes! You can choose from preset colors or use a custom hex color. Ensure good contrast between the QR code and background for reliable scanning. Dark colors on light backgrounds work best."
  },
  {
    question: "Are these QR codes free to use?",
    answer: "Yes! All QR codes generated are completely free and can be used for any purpose - personal or commercial. There are no watermarks, usage limits, or expiration dates."
  }
];

export const Route = createFileRoute('/qr-generator')({
  component: QRGeneratorPage,
  head: () => ({
    meta: [
      {
        title: "QR Code Generator - Create Custom QR Codes Free | BrowserStay",
      },
      {
        name: "description",
        content: "Generate custom QR codes for URLs, text, WiFi, and contacts. Customizable colors, sizes, and error correction. 100% free, private, and generated in your browser.",
      },
      {
        name: "keywords",
        content: "qr code generator, create qr code, wifi qr code, qr code for url, custom qr code, free qr generator, browserstay",
      },
      {
        property: "og:title",
        content: "QR Code Generator - Free & Private",
      },
      {
        property: "og:description",
        content: "Generate custom QR codes in your browser. 100% free, no uploads.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${BASE_URL}/qr-generator`
      }
    ]
  }),
})

function QRGeneratorPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="QR Code Generator"
          subtitle="Create custom QR codes for URLs, text, WiFi credentials, and contact information. Customize colors, sizes, and error correction levels. 100% free and private."
        />

        <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <QRGeneratorProvider>
            <QRGenerator />
          </QRGeneratorProvider>
        </ClientOnly>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Choose Content Type",
                description: "Select URL, text, WiFi, or contact information for your QR code."
              },
              {
                title: "Customize Appearance",
                description: "Set the size, colors, and error correction level for your needs."
              },
              {
                title: "Generate & Download",
                description: "Click generate to create your QR code, then download it in high quality."
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
  )
}