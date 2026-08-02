// vite.config.ts
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    exclude: ["@jsquash/png", "@jsquash/avif", "@jsquash/jpeg", "@jsquash/webp"]
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    // nitro(),
    tailwindcss(),
    tanstackStart({
      srcDirectory: "./src",
      prerender: {
        enabled: true,
        concurrency: 14,
        crawlLinks: true
      },
      sitemap: {
        enabled: true,
        host: "https://browserstay.com"
      }
    }),
    viteReact()
  ]
});
