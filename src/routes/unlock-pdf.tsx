import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { PageHeader } from "@/shared/components/layout/page-header";
import { HowItWorks } from "@/shared/components/layout/how-it-works";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { UnlockPdfProvider, UnlockPdfDropZone, UnlockFileDetails, UnlockActionCard, UnlockError } from "@/features/unlock-pdf";
import { generateMetaFromKey } from "@/lib/seo";

const unlockPdfFaqItems = [
  {
    question: "Is my data safe?",
    answer: "Yes! All processing happens locally in your browser. Your PDF and password never leave your device — nothing is uploaded to any server."
  },
  {
    question: "Which PDF encryptions are supported?",
    answer: "We support the standard PDF encryption types including AES-256, RC4 128-bit, and RC4 40-bit. Unsupported encryption handlers will show a clear error message."
  },
  {
    question: "Will the unlocked PDF look identical?",
    answer: "Yes. Unlocking only removes the password protection — your pages, text, images, and layout are preserved exactly."
  },
  {
    question: "Does this remove the owner password restrictions too?",
    answer: "Yes, the decrypted file is saved without any password, so both opening and editing restrictions are removed."
  }
];

export const Route = createFileRoute("/unlock-pdf")({
  component: UnlockPdfPage,
  head: () => generateMetaFromKey("unlockPdf")
});

function UnlockPdfPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Unlock PDF"
          subtitle="Remove password protection from your PDF. Fast, secure, and fully local."
        />

        <UnlockPdfProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-2 space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <UnlockError />
                <UnlockFileDetails />
                <UnlockPdfDropZone />
              </ClientOnly>
            </div>

            <div className="space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <UnlockActionCard />
              </ClientOnly>
            </div>
          </div>
        </UnlockPdfProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Select your PDF",
                description: "Drop in the password-protected PDF you want to unlock."
              },
              {
                title: "Enter the password",
                description: "Type the password you use to open the document."
              },
              {
                title: "Unlock & Download",
                description: "Your decrypted PDF is ready to download instantly — no uploads."
              }
            ]}
            description="Unlocking PDFs shouldn't be complicated. We make it simple, private, and secure."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={unlockPdfFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  );
}
