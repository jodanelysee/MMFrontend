import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,  // Use Render's assigned port or fallback to 3000 for local dev
    host: true,  // Listen on all IPs (0.0.0.0) so Render can access the app
  },
})
