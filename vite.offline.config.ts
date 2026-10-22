import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Builds the whole platform into ONE self-contained HTML file (all JS, CSS and
 * KaTeX fonts inlined). Double-click it to use the app without a server or internet.
 * Output: dist-offline/econ2103-offline.html
 */
export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteSingleFile({ removeViteModuleLoader: true }),
    {
      // A manifest cannot be loaded from file://, so drop the PWA tags in the single-file build.
      name: 'strip-pwa-tags',
      transformIndexHtml: (html) => html.replace(/\s*<link rel="manifest"[^>]*>/, '').replace(/\s*<link rel="apple-touch-icon"[^>]*>/, ''),
    },
  ],
  build: {
    outDir: 'dist-offline',
    emptyOutDir: true,
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 10_000,
  },
});
