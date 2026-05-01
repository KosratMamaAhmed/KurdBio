import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'; 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', '**/*.apk', 'font/*.ttf'],
      manifest: {
        name: 'BioKurd',
        short_name: 'BioKurd',
        description: 'هەموو بەستەرەکانت لە یەک شوێندا',
        theme_color: '#f59e0b',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/favicon.ico', type: 'image/x-icon', sizes: '16x16 32x32' },
          { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
          { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
          { src: '/icon-192.png', type: 'image/png', sizes: '192x192', purpose: 'maskable' },
          { src: '/icon-512.png', type: 'image/png', sizes: '512x512', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,ttf}'],
        globStrict: false, // 🌟 ئەمە کێشەی Build ی PWA چارەسەر دەکات 🌟
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.qrserver\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'qr-cache', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } }
          },
          {
            urlPattern: /\/api\/public\/.*/i, // لۆدکردنی پرۆفایلەکان لە دۆخی ئۆفلاین
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 5, expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 } }
          },
          {
             urlPattern: /.*\.apk$/i,
             handler: 'NetworkOnly', 
          }
        ]
      }
    })
  ]
});