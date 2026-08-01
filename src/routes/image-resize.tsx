import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageResize } from "@/features/image-resize/image-resize"
import { ImageResizeProvider } from "@/features/image-resize/context"
import { BASE_URL } from "@/lib/seo"

const imageResizeFaqItems = [
  {
    question: "Will I lose image quality when resizing?",
    answer: "Resizing to larger dimensions may reduce quality, but our tool uses high-quality algorithms to minimize degradation. When resizing to smaller dimensions, quality loss is minimal. You can control the output quality using the quality slider."
  },
  {
    question: "What formats are supported?",
    answer: "We support all major image formats including JPG, PNG, WebP, GIF, BMP, and more. You can also convert between formats during the resize process."
  },
  {
    question: "Can I batch resize multiple images?",
    answer: "Yes! You can upload multiple images and they will all be resized to the same dimensions. Each image will be downloaded individually after processing."
  },
  {
    question: "What does 'maintain aspect ratio' mean?",
    answer: "When enabled, the tool will automatically calculate the height or width to preserve the original proportions of your image. This prevents distortion and stretching. For example, a 1920×1080 image resized to 1280px wide will automatically become 1280×720."
  }
];

export const Route = createFileRoute('/image-resize')({
  component: ImageResizePage,
  head: () => ({
    meta: [
      {
        title: "Image Resizer - Resize Images Online Free | BrowserStay",
      },
      {
        name: "description",
        content: "Resize images to any dimension for free. Maintain aspect ratio, batch process multiple images, convert formats — all in your browser with no uploads.",
      },
      {
        name: "keywords",
        content: "image resizer, resize image, resize jpg, resize png, image dimensions, batch resize images, offline resizer, browserstay",
      },
      {
        property: "og:title",
        content: "Image Resizer - Resize Images Free",
      },
      {
        property: "og:description",
        content: "Resize images to any dimension in your browser. 100% free, no uploads.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${BASE_URL}/image-resize`
      }
    ]
  }),
})

function ImageResizePage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Image Resizer"
          subtitle="Resize images to any dimension with precision. Maintain aspect ratio, batch process multiple images, and convert formats. 100% free and private."
        />

        <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
          <ImageResizeProvider>
            <ImageResize />
          </ImageResizeProvider>
        </ClientOnly>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Upload Images",
                description: "Drag & drop your photos. We support JPG, PNG, WebP, and more."
              },
              {
                title: "Set Dimensions",
                description: "Choose your target width, height, and quality. Maintain aspect ratio if needed."
              },
              {
                title: "Resize & Download",
                description: "Images are processed locally. Download them instantly in your preferred format."
              }
            ]}
            description="Resize your images in three simple steps. Fast, secure, and purely client-side."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={imageResizeFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  )
}