import { createFileRoute, ClientOnly } from '@tanstack/react-router'

import { PageHeader } from "@/shared/components/layout/page-header"
import { ConversionSettings } from "@/features/pdf-to-image/components/conversion-settings"
import { FAQ } from "@/features/pdf-to-image/components/faq"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { PdfDropZone } from "@/features/pdf-to-image/components/pdf-drop-zone"
import { PdfFileList } from "@/features/pdf-to-image/components/pdf-file-list"
import { ActionCard } from "@/features/pdf-to-image/components/action-card"
import { PdfToImageProvider } from "@/features/pdf-to-image/context"
import { generateMetaFromKey } from "@/lib/seo"

export const Route = createFileRoute('/pdf-to-image')({
  component: PdfToImagePage,
  head: () => generateMetaFromKey('pdfToImage'),
})

function PdfToImagePage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Convert PDF to Image"
          subtitle="Convert PDF pages to high-quality images with no uploads. Fully local processing, fast, and secure."
        />

        <PdfToImageProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {/* Left Column - Upload & List */}
            <div className="lg:col-span-2 space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <PdfDropZone />
                <PdfFileList />
              </ClientOnly>
            </div>

            {/* Right Column - Settings & Actions */}
            <div className="space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <ConversionSettings />
                <ActionCard />
              </ClientOnly>
            </div>
          </div>
        </PdfToImageProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Add your PDF",
                description: "Choose any PDF from your device. Files never leave your browser."
              },
              {
                title: "Render pages",
                description: "We process each page locally using safe, standards-based rendering."
              },
              {
                title: "Save images",
                description: "Export pages individually or all at once. Great for sharing or archives."
              }
            ]}
            description="Simple, predictable steps anyone can follow. No accounts, no uploads, no learning curve."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQ />
        </section>
      </div>
    </main>
  )
}
