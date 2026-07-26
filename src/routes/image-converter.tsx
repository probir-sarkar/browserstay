import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageConverter } from "@/features/image-converter/image-converter"
import { ImageConverterProvider } from "@/features/image-converter/context"
import { BASE_URL } from "@/lib/seo"

export const Route = createFileRoute('/image-converter')({
  component: ImageConverterPage,
  head: () => ({
    meta: [
      {
        title: "Image Converter - Convert Images Online Free | Toolbox",
      },
      {
        name: "description",
        content: "Convert images between JPG, PNG, WebP, and AVIF. High-quality WebAssembly encoding, batch processing. 100% free, private, and works offline.",
      },
      {
        property: "og:title",
        content: "Image Converter - Free Online",
      },
      {
        property: "og:description",
        content: "Convert images between formats. 100% free and works offline.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${BASE_URL}/image-converter`
      }
    ]
  }),
})

function ImageConverterPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Image Converter"
          subtitle="Convert images between JPG, PNG, WebP, and AVIF with high-quality WebAssembly encoding. Batch processing, 100% free and private."
        />

        <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <ImageConverterProvider>
            <ImageConverter />
          </ImageConverterProvider>
        </ClientOnly>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Add your Images",
                description: "Drag & drop your photos. We support JPG, PNG, WebP, AVIF, and more."
              },
              {
                title: "Choose a Format",
                description: "Pick your target format (JPEG, PNG, WebP, or AVIF) and quality."
              },
              {
                title: "Convert & Save",
                description: "Images are processed locally in your browser. Download individually or as a ZIP."
              }
            ]}
            description="Convert and optimize your images in three simple steps. Fast, secure, and purely client-side."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Is it really offline?",
                answer: "Yes. All image processing happens in your browser using WebAssembly. Your photos are never uploaded to any server."
              },
              {
                question: "What formats are supported?",
                answer: "You can convert to JPEG, PNG, WebP, or AVIF. Most common input formats (JPG, PNG, WebP, AVIF, GIF, and more) are accepted."
              },
              {
                question: "Which format should I choose?",
                answer: "WebP and AVIF offer the best compression for the web. JPEG is universally supported and great for photos. PNG is lossless and ideal when you need transparency or exact quality."
              },
              {
                question: "Does quality affect every format?",
                answer: "Quality applies to the lossy formats (JPEG, WebP, AVIF). PNG is lossless, so the quality slider has no effect on it."
              },
              {
                question: "Limits on file size?",
                answer: "Since processing is local, the limit depends on your device's memory. Most modern devices can handle very large images easily."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
