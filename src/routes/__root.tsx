/// <reference types="vite/client" />
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "@/styles/globals.css?url";
import { Navbar } from "@/shared/components/layout/navbar";
import { Footer } from "@/shared/components/layout/footer";
import { ThemeProvider } from "@/shared/components/layout/theme-provider";
import { SkipLink } from "@/shared/components/layout/skip-link";
import { BASE_URL } from "@/lib/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      { title: "BrowserStay - Free Privacy-First PDF & Image Tools, No Uploads" },
      {
        name: "description",
        content:
          "Free, private PDF and image tools that run entirely in your browser. Your files never leave your PC — no uploads, no accounts, no servers, no limits."
      },
      {
        name: "keywords",
        content:
          "pdf tools, image tools, merge pdf, compress image, privacy tools, no upload, browser pdf, browserstay"
      },
      // Open Graph / Facebook
      {
        property: "og:type",
        content: "website"
      },
      {
        property: "og:title",
        content: "BrowserStay - Free Privacy-First Tools, No Uploads"
      },
      {
        property: "og:description",
        content: "Free, private PDF & image tools that stay in your browser. Your files never leave your PC."
      },
      {
        property: "og:image",
        content: `${BASE_URL}/og-image.png`
      },
      // Twitter
      {
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        name: "twitter:title",
        content: "BrowserStay - Free Privacy-First Tools, No Uploads"
      },
      {
        name: "twitter:description",
        content: "Free, private PDF & image tools that stay in your browser. Your files never leave your PC."
      },
      {
        name: "twitter:image",
        content: `${BASE_URL}/og-image.png`
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg"
      }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "BrowserStay",
          url: BASE_URL,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          description:
            "Free, private, open-source PDF and image tools that run entirely in your browser. No uploads, no accounts, no servers.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          },
          featureList: [
            "Merge, split, and convert PDFs",
            "Convert, resize, and compress images",
            "QR code and password generation",
            "100% local processing, no uploads"
          ]
        })
      }
    ]
  }),
  component: RootLayout
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SkipLink />
          <Navbar />
          <div className="flex-1" id="main-content" tabIndex={-1}>
            <Outlet />
          </div>
          <Footer />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
