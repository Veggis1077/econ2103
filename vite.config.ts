/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { offlineServiceWorker } from './offline-plugin';

// Relative base + HashRouter means the build works under any GitHub Pages
// sub-path (https://<user>.github.io/<repo>/) without configuration.
// Override with VITE_BASE=/repo-name/ if absolute asset URLs are preferred.
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react(), offlineServiceWorker()],
  build: {
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'katex', test: /node_modules[\\/]katex/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
