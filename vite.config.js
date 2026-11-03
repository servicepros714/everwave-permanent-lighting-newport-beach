import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seoPlugin } from './scripts/seo.js';

export default defineConfig({
  plugins: [react(), seoPlugin()],
  // Inline (empty) PostCSS config so Vite never picks up a postcss.config.js from a parent folder.
  css: { postcss: { plugins: [] } },
  build: { outDir: 'dist', sourcemap: false },
});
