import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from '@svgr/rollup';
import viteCompression from 'vite-plugin-compression';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr(), viteCompression()],
  server: {
    port: 8080,
  },
});
