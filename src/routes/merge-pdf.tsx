import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { PageHeader } from "@/shared/components/layout/page-header";
import { HowItWorks } from "@/shared/components/layout/how-it-works";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { MergePdfDropZone } from "@/features/merge-pdf/components/drop-zone";
import { MergeFileList } from "@/features/merge-pdf/components/file-list";
import { MergeSettings } from "@/features/merge-pdf/components/settings";
import { MergeActionCard } from "@/features/merge-pdf/components/action-card";
import { MergeError } from "@/features/merge-pdf/components/error-display";
import { MergePdfProvider } from "@/features/merge-pdf/context";
import { BASE_URL } from "@/lib/seo";

const mergePdfFaqItems = [
  {
    question: "Is there a file size limit?",
    answer: "No, you can merge PDFs of any size. The processing happens locally on your device, so the only limit is your available memory."
  },
  {
    question: "Can I merge password-protected PDFs?",
    answer: "You can merge password-protected PDFs if you know the password. However, the merged PDF will not retain the password protection."
  },
  {
    question: "What happens to the original PDFs?",
    answer: "Your original PDF files are never modified or uploaded. The merging process creates a new PDF file, leaving your originals intact."
  },
  {
    question: "Can I reorder the PDFs before merging?",
    answer: "Yes, you can drag and drop the files in the list to set the order they will appear in the merged PDF."
  }
];

export const Route = createFileRoute("/merge-pdf")({
  component: MergePdfPage,
  head: () => ({
    meta: [
      {
        title: "Merge PDF Files - Free Online PDF Combiner | BrowserStay"
      },
      {
        name: "description",
        content:
          "Combine multiple PDF files into one document for free. Merge PDFs in seconds — no uploads, no registration, 100% private and processed locally in your browser."
      },
      {
        name: "keywords",
        content: "merge pdf, combine pdf, join pdf, pdf combiner, merge pdf files free, offline merge pdf, browserstay"
      },
      {
        property: "og:title",
        content: "Merge PDF Files - Free & Private"
      },
      {
        property: "og:description",
        content: "Combine multiple PDFs into one. In your browser, no uploads."
      }
    ],
    links: [
      {
        rel: "canonical",
        href: `${BASE_URL}/merge-pdf`
      }
    ]
  })
});

function MergePdfPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Merge PDF Files"
          subtitle="Combine multiple PDFs into a single document. Fast, secure, and fully offline."
        />

        <MergePdfProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {/* Left Column - Upload & List */}
            <div className="lg:col-span-2 space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <MergeError />
                <MergePdfDropZone />
                <MergeFileList />
              </ClientOnly>
            </div>

            {/* Right Column - Settings & Actions */}
            <div className="space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <MergeSettings />
                <MergeActionCard />
              </ClientOnly>
            </div>
          </div>
        </MergePdfProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Select PDFs",
                description: "Drop your PDF files here. You can select multiple files at once."
              },
              {
                title: "Arrange & Sort",
                description: "Drag and drop the files in the list to set the order of the merged document."
              },
              {
                title: "Merge & Download",
                description: "Click Merge to combine them instantly. Your new PDF is ready to download."
              }
            ]}
            description="Our merge tool is designed for speed and privacy. No uploads, just instant merging."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={mergePdfFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  );
}
