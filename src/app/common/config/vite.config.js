import { defineConfig } from 'vite';
import { createAngularPlugin } from '@nx/vite/plugins/angular';

export default defineConfig({
  plugins: [createAngularPlugin()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces for external access
    port: 4200, // Match Angular’s default port
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://127.0.0.1:3000', // Backend URL
        changeOrigin: true, // Modify Host header
        secure: false, // Allow self-signed certificates
        rewrite: (path) => path.replace(/^\/api/, ''), // Strip /api prefix
      },
    },
  },
});