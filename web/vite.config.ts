/// <reference types="vitest" />
import { defineConfig } from 'vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
    },
  },
  server: {
    host: '0.0.0.0', // Bind to all interfaces for Docker
    port: 3000,
    watch: {
      usePolling: true, // Enable polling for file changes in Docker
      interval: 1000, // Poll every second
    },
    hmr: {
      port: 3000, // Use same port for HMR
    },
  },
  // Vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
