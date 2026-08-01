import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { ImageToPdf } from "@/features/image-to-pdf/image-to-pdf"
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { ImageToPdfProvider } from "@/features/image-to-pdf/context"
import { generateMetaFromKey } from "@/lib/seo"

const imageToPdfFaqItems = [
  {
    question: "Is it safe? Are my images uploaded?",
    answer: "Yes, it is 100% safe. Your images are processed entirely within your browser. They are never uploaded to any server, ensuring complete privacy."
  },
  {
    question: "What image formats are supported?",
    answer: "We support common image formats including JPG, PNG, and WebP."
  },
  {
    question: "Can I reorder the pages?",
    answer: "Yes! Once you upload your images, you can simply drag and drop them to arrange the order of pages in your PDF."
  },
  {
    question: "Does it limit the number of images?",
    answer: "There is no hard limit on the number of images. However, processing a very large number of high-resolution images might be limited by your device's memory."
  }
];

export const Route = createFileRoute('/image-to-pdf')({
  component: ImageToPdfPage,
  head: () => generateMetaFromKey('imageToPdf'),
})

function ImageToPdfPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Image to PDF Converter"
          subtitle="Turn your images into a single PDF document. Sortable pages, custom settings, and fully local processing."
        />

        <div className="mb-24">
          <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <ImageToPdfProvider>
              <ImageToPdf />
            </ImageToPdfProvider>
          </ClientOnly>
        </div>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Upload Images",
                description: "Drag & drop your images. We support JPG, PNG, and WebP."
              },
              {
                title: "Arrange Pages",
                description: "Drag images to reorder them. This order will be used in the PDF."
              },
              {
                title: "Download PDF",
                description: "Customize settings like page size and orientation, then download."
              }
            ]}
            description="Create professional PDFs from your images in seconds."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={imageToPdfFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  )
}
