import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    port: 3012,
    strictPort: true,
  },
  preview: {
    port: 3013,
    strictPort: true,
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Games Hub',
        short_name: 'Games',
        description: 'A lightweight mobile-friendly arcade with scores.',
        theme_color: '#101010',
        background_color: '#101010',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'icon_192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon_512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icon_192_maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'icon_512_maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
