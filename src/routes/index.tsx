import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, WifiOff, Gift } from "lucide-react"
import { ToolsSection } from "@/shared/components/layout/tools-section"
import { TrustBar } from "@/shared/components/layout/trust-bar"
import { GithubIcon } from "@/shared/components/common"
import { SITE_CONFIG } from "@/config/site"
import { generateMetaFromKey } from "@/lib/seo"

export const Route = createFileRoute('/')({
  component: HomePage,
  head: () => generateMetaFromKey('home'),
})

const whyCards = [
  {
    icon: ShieldCheck,
    title: "Private by design",
    description:
      "Files are processed in your browser with WebAssembly. Nothing is uploaded — not to the EU, the US, China, or anywhere else. There are no servers to leak your data."
  },
  {
    icon: GithubIcon,
    title: "Open source",
    description:
      "Every line of code is public on GitHub under Apache 2.0. Auditable, forever free, and yours. If you can read code, you can verify exactly what happens to your files."
  },
  {
    icon: WifiOff,
    title: "Processed on your device",
    description:
      "Every file is processed locally in your browser with WebAssembly. Nothing is ever sent to a server — your data never leaves your computer."
  },
  {
    icon: Gift,
    title: "Free, no limits",
    description:
      "No account, no watermark, no file-size caps, no premium paywall. Just fast, private tools that respect you and your files."
  }
]

const howItWorks = [
  {
    step: "1",
    title: "Choose a tool",
    description: "Pick the PDF or image tool you need — merge, split, convert, resize, compress, and more."
  },
  {
    step: "2",
    title: "Add your files",
    description: "Drag and drop files from your device. They stay in your browser the entire time."
  },
  {
    step: "3",
    title: "Download the result",
    description: "Get your finished file instantly. Nothing uploaded, nothing stored, nothing to worry about."
  }
]

function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[50%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-6 md:pt-32 md:pb-8 px-6">
        <div className="container mx-auto relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-8">
            <ShieldCheck className="w-4 h-4 mr-2" />
            <span>Free forever · No uploads · No sign-up</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8">
            Your files never leave <br className="hidden md:block" /> your PC.
          </h1>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            BrowserStay is a free, open-source collection of PDF and image tools that run entirely in
            your browser. No uploads. No accounts. No servers. No waiting.
          </p>

          <TrustBar />
        </div>
      </section>

      {/* Tools Grid */}
      <ToolsSection />

      {/* Why BrowserStay */}
      <section className="container mx-auto px-6 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why BrowserStay?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Most online tools upload your files to their servers. We don't — because we built every
              tool to run right in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whyCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-border/40 bg-card p-6 hover:border-border/80 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary w-fit mb-4">
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps. No account, no installation, no learning curve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-border/40 bg-card p-6 text-center"
              >
                <div className="text-3xl font-bold text-primary mb-3">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source Callout */}
      <section className="container mx-auto px-6 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-linear-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 md:p-8 border border-primary/20 text-center">
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                100% open source. Yours forever.
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                BrowserStay is built in the open and released under the Apache 2.0 license. That means
                it's free to use, free to audit, and free to build on — today and always.
              </p>
              <a
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-lg text-sm md:text-base"
              >
                <GithubIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                View source on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
