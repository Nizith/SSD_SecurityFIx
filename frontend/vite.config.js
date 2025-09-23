// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Fixing the Missing Anti-clickjacking Header issue
      'X-Frame-Options': 'DENY',
      //X-Content-Type-Options Header Missing
      'X-Content-Type-Options': 'nosniff',
    },
  },
})
