import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Cloudflare Pages deploys to root, no base path needed
  plugins: [react()],
})
