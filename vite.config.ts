import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'vienna.pgn', 'icons/*.png', 'vite.svg'],
      manifest: {
        name: 'ChessOp - Opening Repertoire Trainer',
        short_name: 'ChessOp',
        description: 'Master chess opening repertoires through tactile active recall, spaced repetition, and AI sparring.',
        theme_color: '#181512',
        background_color: '#181512',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        categories: ['games', 'education', 'sports'],
        icons: [
          {
            src: '/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icons/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,pgn,json}'],
        runtimeCaching: [
          {
            urlPattern: /\.(?:pgn)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pgn-repertoire-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});
