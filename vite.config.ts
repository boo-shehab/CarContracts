import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from '@svgr/rollup';
import viteCompression from 'vite-plugin-compression';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), viteCompression()],
  server: {
    port: 8080, // since your logs show localhost:8080
    proxy: {
      '/api': {
        target: 'https://209.127.228.55:8082',
        changeOrigin: true,
        secure: false, // disable SSL verification if backend has self-signed cert
      },
    },
  },
});
