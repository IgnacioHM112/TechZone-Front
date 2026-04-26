import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Escucha en todas las interfaces (0.0.0.0)
    allowedHosts: true, // Permite cualquier host (incluyendo ngrok)
    port: 5173,
  }
})
