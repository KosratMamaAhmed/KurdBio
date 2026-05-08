import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'; 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
    VitePWA({
      registerType: 'prompt', // 🔴 باشترە بۆ کۆنترۆڵی ئەپدەیت (وەک دەرمانزانی)
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'font/*.ttf'],
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
        cleanupOutdatedCaches: true, // 🔴 گرنگ: کاشە کۆنەکان دەسڕێتەوە بۆ ڕێگری لە کراش
        clientsClaim: true,          // 🔴 گرنگ: سێرڤس وۆرکەری نوێ خێرا جێگەی خۆی دەگرێت
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,ttf,woff,woff2,svg,json}'],
        maximumFileSizeToCacheInBytes: 15485760, // 🔴 ڕێگری لە کێشەی قەبارەی کاش دەکات
        runtimeCaching: [
          {
            // 🔴 کاشکردنی فۆنتەکان بۆ ئۆفلاین و خێرایی (وەک دەرمانزانی)
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /^https:\/\/api\.qrserver\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'qr-cache', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } }
          },
          {
            urlPattern: /\/api\/public\/.*/i,
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
  ],
  build: {
    // 🔴 سیستەمی خێراکردن و سڕینەوەی داتای زیادە بۆ پڕۆدەکشن (وەک دەرمانزانی)
    chunkSizeWarningLimit: 5000,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true }
    }
  }
});