import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { SplitPdfDropZone } from "@/features/split-pdf/components/drop-zone"
import { SplitFileDetails } from "@/features/split-pdf/components/file-details"
import { SplitControls } from "@/features/split-pdf/components/split-controls"
import { SplitError } from "@/features/split-pdf/components/error-display"
import { SplitPdfProvider, useSplitPdfContext } from "@/features/split-pdf/context"
import { BASE_URL } from "@/lib/seo"

function SplitPdfContent() {
  const { fileData } = useSplitPdfContext()
  return (
    <>
      <SplitError />
      {!fileData ? <SplitPdfDropZone /> : <SplitFileDetails />}
    </>
  )
}

const splitPdfFaqItems = [
  {
    question: "Is my data safe?",
    answer: "Yes! All processing happens locally in your browser. Your files are never uploaded to any server, ensuring 100% privacy and security."
  },
  {
    question: "Can I extract specific pages?",
    answer: "Yes, simply select 'Extract pages' and enter the page numbers or ranges (e.g., '1-5, 8, 10-12') to create a new PDF with just those pages."
  },
  {
    question: "How do I get all pages as separate files?",
    answer: "Select the 'Split all pages' option. This will save every page of your PDF as a separate file and download them together in a ZIP archive."
  },
  {
    question: "Does it support encrypted PDFs?",
    answer: "If the PDF is password protected, you will need to decrypt it first. We currently support standard unencrypted PDFs for automatic processing."
  }
];

export const Route = createFileRoute('/split-pdf')({
  component: SplitPdfPage,
  head: () => ({
    meta: [
      {
        title: "Split PDF File - Extract Pages Free Online | BrowserStay",
      },
      {
        name: "description",
        content: "Split PDF files and extract pages for free. Separate a PDF into individual pages or extract specific ranges — all locally in your browser, no uploads, 100% private.",
      },
      {
        name: "keywords",
        content: "split pdf, extract pages from pdf, split pdf online, pdf page extractor, offline split pdf, browserstay",
      },
      {
        property: "og:title",
        content: "Split PDF File - Extract Pages Free",
      },
      {
        property: "og:description",
        content: "Split PDF files and extract pages. In your browser, no uploads.",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: `${BASE_URL}/split-pdf`
      }
    ]
  }),
})

function SplitPdfPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Split PDF File"
          subtitle="Extract specific pages or split your PDF into separate documents."
        />

        <SplitPdfProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-2 space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <SplitPdfContent />
              </ClientOnly>
            </div>

            <div className="space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <SplitControls />
              </ClientOnly>
            </div>
          </div>
        </SplitPdfProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Upload PDF",
                description: "Select the PDF file you want to split or extract pages from."
              },
              {
                title: "Choose Mode",
                description: "Select 'Extract pages' to create a new PDF or 'Split all pages' to separate them."
              },
              {
                title: "Process & Save",
                description: "Click the button to process your file and download the result instantly."
              }
            ]}
            description="Splitting PDFs shouldn't be complicated. We make it simple and secure."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={splitPdfFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  )
}
