import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageConversionSettings } from "@/features/image-converter/components/conversion-settings"
import { ImageDropZone } from "@/features/image-converter/components/image-drop-zone"
import { FileList } from "@/features/image-converter/components/file-list"
import { ActionCard } from "@/features/image-converter/components/action-card"
import { ImageConverterProvider } from "@/features/image-converter/context"
import { BASE_URL } from "@/lib/seo"

export const Route = createFileRoute('/image-converter')({
  component: ImageConverterPage,
  head: () => ({
    meta: [
      {
        title: "Image Converter & Optimizer - Convert & Compress Images Free | Toolbox",
      },
      {
        name: "description",
        content: "Convert, resize, and compress images in bulk. Support for JPG, PNG, WebP, and more. 100% free, private, and works offline.",
      },
      {
        property: "og:title",
        content: "Image Converter & Optimizer - Free",
      },
      {
        property: "og:description",
        content: "Convert, resize, and compress images. 100% free and works offline.",
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
          title="Image Converter & Optimizer"
          subtitle="Convert, resize, and compress images in bulk. 100% free, private, and runs entirely in your browser."
        />

        <ImageConverterProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {/* Left Column - Upload & List */}
            <div className="lg:col-span-2 space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <ImageDropZone />
                <FileList />
              </ClientOnly>
            </div>

            {/* Right Column - Settings & Actions */}
            <div className="space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <ImageConversionSettings />
                <ActionCard />
              </ClientOnly>
            </div>
          </div>
        </ImageConverterProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Add your Images",
                description: "Drag & drop your photos. We support JPG, PNG, WebP, and more."
              },
              {
                title: "Choose Settings",
                description: "Select your target format, quality, and optimization preferences."
              },
              {
                title: "Convert & Save",
                description: "Images are processed locally. Download them individually or as a ZIP."
              }
            ]}
            description="Optimize and transform your images in three simple steps. Fast, secure, and purely client-side."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection
            items={[
              {
                question: "Is it really offline?",
                answer: "Yes. All image processing happens in your browser using modern web technologies. Your photos are never uploaded to any server."
              },
              {
                question: "What formats are supported?",
                answer: "We support input for most common image formats like JPG, PNG, WebP, GIF, and others. You can convert them to JPG, PNG, WebP, or AVIF."
              },
              {
                question: "How do you ensure highest quality?",
                answer: "We use WebAssembly (WASM) for high-performance image processing. This ensures the highest quality conversion and compression while maintaining fast performance, all running locally in your browser."
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
