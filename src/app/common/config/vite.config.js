import { defineConfig } from 'vite';
import { createProxy } from 'vite-plugin-proxy';
import { createAngularPlugin } from '@nx/vite/plugins/angular';

export default defineConfig({
  plugins: [createAngularPlugin()],
  server: {
    proxy: createProxy({
      '/api': {
        target: 'https://2ca8aa99681e.ngrok-free.app' || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
      },
    }),
  },
});