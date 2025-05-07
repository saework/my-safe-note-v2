import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/api': {
        target: 'http://app:80', // используем имя сервиса из docker-compose
        secure: false
      }
    },
    port: 5173
  }
});
