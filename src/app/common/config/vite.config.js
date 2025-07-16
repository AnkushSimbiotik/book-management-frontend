import { defineConfig } from 'vite';
import angular from '@angular/vite';

export default defineConfig({
  plugins: [angular()],
  server: {
    host: '0.0.0.0', // Allow external access
    port: 4200, // Ensure this matches Angular’s default port
    allowedHosts: [
      'localhost',
      '5bb610fb4f76.ngrok-free.app', // ngrok URL
    ],
  },
});