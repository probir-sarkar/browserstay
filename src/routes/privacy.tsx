import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, WifiOff, HardDrive, FileSearch, EyeOff, Server } from "lucide-react"
import { generateMetaFromKey } from "@/lib/seo"

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => generateMetaFromKey('privacy'),
})

const commitments = [
  {
    icon: WifiOff,
    title: "No uploads, ever",
    description:
      "All processing happens locally in your browser using WebAssembly. Files are never transmitted over the network — there is no upload step, period."
  },
  {
    icon: HardDrive,
    title: "No storage, no servers",
    description:
      "BrowserStay has no backend servers and no databases. We don't store your files, your metadata, or copies of anything you process — nothing exists outside your device."
  },
  {
    icon: EyeOff,
    title: "No tracking or analytics",
    description:
      "We don't use analytics scripts, tracking cookies, fingerprinting, or advertising. There is nothing to collect and nothing to sell."
  },
  {
    icon: FileSearch,
    title: "No accounts, no personal data",
    description:
      "There is no sign-up, no profile, and no personal information requested. We simply cannot know who you are because we never ask."
  }
]

const facts = [
  "Your files are read and processed entirely within your browser's memory.",
  "Nothing you upload is uploaded — files never leave your computer.",
  "Results are generated on your device and handed straight to your browser's download.",
  "Closing the tab or clearing your browser cache removes any trace of your session."
]

function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-6 py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
              <ShieldCheck className="w-4 h-4 mr-2" />
              <span>Privacy Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              Your privacy is the product. There is no product.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <section className="space-y-6 mb-16">
            <p className="text-foreground leading-relaxed">
              BrowserStay is a collection of free, open-source tools that run entirely in your browser.
              This policy is short because there is almost nothing to say: we do not collect, store,
              share, or even see your data.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              The site is served as static files — no server-side application code runs when you use a
              tool, and no code of ours ever touches your files.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-8">What we promise</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {commitments.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/40 bg-card p-6 hover:border-border/80 transition-colors"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How your files are handled</h2>
            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-3">
              {facts.map((fact) => (
                <div key={fact} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What about hosting?</h2>
            <div className="rounded-2xl border border-border/40 bg-card p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Server className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The static files that make up BrowserStay are served from a CDN. Standard, anonymized
                  CDN request logs (IP address, user agent, requested file) may exist for operational
                  purposes like security and performance. These logs contain no file content, are never
                  used for advertising or profiling, and are retained only as long as the CDN provider
                  requires.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <FileSearch className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We do not read these logs to learn about you. They exist solely to keep the site
                  running and protected from abuse.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies & local storage</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              BrowserStay does not use cookies for tracking. We may use your browser's local storage
              only for functional preferences you set yourself, such as your theme choice. These
              preferences stay on your device and are never transmitted anywhere.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Open source & transparency</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every line of code is public on GitHub under the Apache 2.0 license. If you can read
              code, you can verify these promises yourself — audit the repository, inspect the
              network tab while using a tool, and confirm that nothing leaves your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about this policy? Open an issue on our GitHub repository and we'll get back
              to you.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
