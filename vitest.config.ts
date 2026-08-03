import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      instances: [
        { browser: 'chromium' },
      ],
    },
  }
})