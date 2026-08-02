import { createFileRoute, Link } from '@tanstack/react-router'
import { Layers, ShieldCheck, WifiOff, Gift } from "lucide-react"
import { GithubIcon } from "@/shared/components/common"
import { SITE_CONFIG } from "@/config/site"
import { generateMetaFromKey } from "@/lib/seo"

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () => generateMetaFromKey('about'),
})

const values = [
  {
    icon: ShieldCheck,
    title: "Private by design",
    description:
      "Files are processed in your browser with WebAssembly. Nothing is uploaded — there are no servers to leak your data, and no accounts to tie it to you."
  },
  {
    icon: WifiOff,
    title: "Works offline-first",
    description:
      "Because everything runs locally, most tools work even when your connection drops. Your files never leave your computer, ever."
  },
  {
    icon: Gift,
    title: "Free, no limits",
    description:
      "No account, no watermark, no file-size caps, no premium paywall. Just fast, private tools that respect you and your files."
  },
  {
    icon: GithubIcon,
    title: "Open source",
    description:
      "Every line of code is public on GitHub under the Apache 2.0 license. Auditable, forever free, and yours."
  }
]

function AboutPage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      <div className="container mx-auto px-6 py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 space-y-6">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
              <Layers className="w-4 h-4 mr-2" />
              <span>About BrowserStay</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
              Private tools, built in the open.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              BrowserStay is a free, open-source collection of PDF and image tools that run entirely
              in your browser. No uploads. No accounts. No servers. No waiting.
            </p>
          </div>

          <section className="space-y-6 mb-16">
            <p className="text-foreground leading-relaxed">
              Most "free" online tools make you trade away your files — you upload a document and
              hope the site treats it well. BrowserStay was built on a simple, opposite idea: your
              files should never leave your computer in the first place.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Every tool uses WebAssembly and modern browser APIs to process files locally, on your
              device. That makes the site fast, free to run, and genuinely private — not as a feature
              to be sold, but as the default.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-8">What we stand for</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((item) => (
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
            <h2 className="text-2xl font-semibold text-foreground mb-4">Why it exists</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              BrowserStay started with a frustration: converting a PDF or resizing an image shouldn't
              require handing your file to a stranger's server. It's a small, independent project —
              no company, no venture capital, no data deals. Just useful tools that respect you.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Because the project is open source, anyone can audit how it works, suggest changes, or
              build on it. That transparency is the whole point: if you can read code, you can verify
              exactly what happens to your files.
            </p>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Get involved</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              BrowserStay is built in the open and released under the Apache 2.0 license. Report a
              bug, request a tool, or contribute code — every contribution helps.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                View source on GitHub
              </a>
              <a
                href={SITE_CONFIG.links.issues}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg font-semibold hover:border-primary/60 hover:text-primary transition-colors"
              >
                Report an issue
              </a>
            </div>
          </section>

          <section className="rounded-2xl border border-border/40 bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">Privacy</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Curious about how your data is handled? We keep it simple: it isn't. Read the full
              details on our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
