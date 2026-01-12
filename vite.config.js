import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    nodePolyfills(),
    react()
  ],
  server: {
    allowedHosts: ['configurationally-interfascicular-shandra.ngrok-free.dev']
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js'
  }
});
