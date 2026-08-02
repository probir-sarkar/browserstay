import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { PageHeader } from "@/shared/components/layout/page-header";
import { HowItWorks } from "@/shared/components/layout/how-it-works";
import { FAQSection } from "@/shared/components/layout/faq-section";
import { EncryptPdfProvider, EncryptPdfDropZone, EncryptFileDetails, EncryptActionCard } from "@/features/encrypt-pdf";
import { generateMetaFromKey } from "@/lib/seo";

const encryptPdfFaqItems = [
  {
    question: "Is my data safe?",
    answer: "Yes! All processing happens locally in your browser. Your PDF and password never leave your device — nothing is uploaded to any server."
  },
  {
    question: "What type of encryption is used?",
    answer: "Your PDF is encrypted with a strong password-based security handler that requires the password to open the document."
  },
  {
    question: "What if I forget the password?",
    answer: "There is no way to recover a forgotten password — the encryption is designed so only someone with the correct password can open the file. Keep your password safe."
  },
  {
    question: "Will the encrypted PDF look identical?",
    answer: "Yes. Encryption only adds password protection — your pages, text, images, and layout are preserved exactly."
  }
];

export const Route = createFileRoute("/encrypt-pdf")({
  component: EncryptPdfPage,
  head: () => generateMetaFromKey("encryptPdf")
});

function EncryptPdfPage() {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Encrypt PDF"
          subtitle="Protect your PDF with a password. Fast, secure, and fully local."
        />

        <EncryptPdfProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            <div className="lg:col-span-2 space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <EncryptFileDetails />
                <EncryptPdfDropZone />
              </ClientOnly>
            </div>

            <div className="space-y-6">
              <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
                <EncryptActionCard />
              </ClientOnly>
            </div>
          </div>
        </EncryptPdfProvider>

        <section className="mb-24">
          <HowItWorks
            steps={[
              {
                title: "Select your PDF",
                description: "Drop in the PDF file you want to protect."
              },
              {
                title: "Set a password",
                description: "Choose a strong password and confirm it."
              },
              {
                title: "Encrypt & Download",
                description: "Your password-protected PDF is ready to download instantly — no uploads."
              }
            ]}
            description="Protecting PDFs shouldn't be complicated. We make it simple, private, and secure."
          />
        </section>

        <section className="max-w-3xl mx-auto mb-12">
          <FAQSection items={encryptPdfFaqItems} title="Frequently Asked Questions" />
        </section>
      </div>
    </main>
  );
}
