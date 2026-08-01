import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageCompressor } from "@/features/image-compressor/image-compressor"
import { ImageCompressorProvider } from "@/features/image-compressor/context"
import { BASE_URL } from "@/lib/seo"

const imageCompressorFaqItems = [
  {
    question: "How much can I reduce the file size?",
    answer: "The compression ratio depends on the image content and quality settings. Typically, you can reduce file sizes by 50-80% with minimal visible quality loss. Photos with lots of detail compress better than simple graphics."
  },
  {
    question: "Will compression affect image quality?",
    answer: "There's always a trade-off between file size and quality. Our tool uses high-quality compression algorithms to minimize quality loss. You can preview the compression ratio and adjust quality settings to find the right balance."
  },
  {
    question: "What format should I choose?",
    answer: "JPEG offers the best compression for photos. WebP provides even better compression with good quality but may not be supported by older browsers. PNG is lossless but results in larger files. Choose based on your use case."
  },
  {
    question: "Can I batch compress multiple images?",
    answer: "Yes! Upload multiple images and they'll all be compressed using the same settings. Each image will be downloaded individually after compression."
  }
];

export const Route = createFileRoute('/image-compressor')({
  component: ImageCompressorPage,
  head: () => ({
    meta: [
      {
        title: "Image Compressor - Compress Images Online Free | BrowserStay",
      },
      {
        name: "description",
        content: "Compress images to reduce file size while keeping quality. Smart compression, batch processing, multiple formats — 100% free, private, and processed locally in your browser.",
      },
      {
        name: "keywords",
        content: "image compressor, compress image, reduce image size, compress jpg, compress png, photo compressor, offline compression, browserstay",
      },
      {
        property: "og:title",
        content: "Image Compressor - Free & Private",
      },
      {
        property: "og:description",
        content: "Compress images to reduce file size. 100% free, processed in your browser.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${BASE_URL}/image-compressor`
      }
    ]
  }),
})

function ImageCompressorPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Image Compressor"
          subtitle="Compress images to reduce file size while maintaining quality. Smart compression algorithms, batch processing, and format conversion. 100% free and private."
        />

        <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <ImageCompressorProvider>
            <ImageCompressor />
          </ImageCompressorProvider>
        </ClientOnly>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Upload Images",
                description: "Drag & drop your photos. We support JPG, PNG, WebP, and more."
              },
              {
                title: "Adjust Quality",
                description: "Set compression quality, max dimensions, and target file size."
              },
              {
                title: "Compress & Download",
                description: "Images are optimized locally. See compression ratios and download instantly."
              }
            ]}
            description="Optimize your images in three simple steps. Fast, secure, and purely client-side."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={imageCompressorFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  )
}