import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ngrokHost = process.env.NGROK_HOST;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: true,
    port: 5173,
    hmr: ngrokHost ? {
      protocol: 'wss',
      host: ngrokHost,
      clientPort: 443
    } : undefined,
  }
})
