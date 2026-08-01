import { createFileRoute, ClientOnly } from '@tanstack/react-router'
import { PageHeader } from "@/shared/components/layout/page-header"
import { HowItWorks } from "@/shared/components/layout/how-it-works"
import { FAQSection } from "@/shared/components/layout/faq-section"
import { PasswordGenerator } from "@/features/password-generator/components/password-generator"
import { generateMetaFromKey } from "@/lib/seo"

export const Route = createFileRoute('/password-generator')({
  component: PasswordGeneratorPage,
  head: () => generateMetaFromKey('passwordGenerator'),
})

function PasswordGeneratorPage() {
  return (
    <main className="container mx-auto p-6 space-y-12">
      <div className="max-w-6xl mx-auto space-y-12">
        <PageHeader
          title="Secure Password Generator"
          subtitle="Create strong, uncrackable passwords instantly in your browser. Generated locally, never sent anywhere."
        />

        <div className="w-full max-w-3xl mx-auto">
          <ClientOnly fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
            <PasswordGenerator />
          </ClientOnly>
        </div>

        {/* How It Works */}
        <section className="mb-12">
          <HowItWorks
            steps={[
              {
                title: "Customize",
                description:
                  "Select the length and types of characters (uppercase, lowercase, numbers, symbols) you want."
              },
              {
                title: "Generate",
                description:
                  "We use your browser's secure random number generator to create a unique password instantly."
              },
              {
                title: "Copy & Use",
                description: "Click to copy your new secure password. It's never stored or sent anywhere."
              }
            ]}
            description="Generating a strong password takes less than a second."
          />
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto">
          <FAQSection
            title="Frequently Asked Questions"
            items={[
              {
                question: "Is my password really secure?",
                answer:
                  "Yes. Passwords are generated entirely within your browser using the Web Crypto API, which provides cryptographically strong random values. Your password is never sent to any server."
              },
              {
                question: "Do you store the passwords?",
                answer:
                  "No. The entire process happens locally on your device. Once you close this tab or refresh the page, the generated password is gone forever."
              },
              {
                question: "Why should I use a generated password?",
                answer:
                  "Humans are predictable and often choose patterns that are easy for computers to guess (like 'Password123'). A randomly generated password with a mix of characters is mathematically much harder to crack."
              },
              {
                question: "What makes a password strong?",
                answer:
                  "A strong password is long (12+ characters) and includes a mix of uppercase letters, lowercase letters, numbers, and symbols. This maximizes the number of possible combinations, increasing security."
              }
            ]}
          />
        </section>
      </div>
    </main>
  )
}
