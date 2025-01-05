import { defineConfig } from "vite";

export default defineConfig({
  base: '',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'style.css'
      }
    }
  },
});