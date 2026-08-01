import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageConverter } from "@/features/image-converter/image-converter"
import { ImageConverterProvider } from "@/features/image-converter/context"
import { generateMetaFromKey } from "@/lib/seo"

export const Route = createFileRoute('/image-converter')({
  component: ImageConverterPage,
  head: () => generateMetaFromKey('imageConverter'),
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
                answer: "Processing is 100% local. All image encoding happens in your browser using WebAssembly, and your photos are never uploaded to any server. An internet connection is needed to load the page, but your files never leave your device."
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
