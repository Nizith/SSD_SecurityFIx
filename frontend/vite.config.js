// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // Remove server version info
      'Server': '',
      //Fixes for CSP vulnerability - Strict CSP without wildcards
      'Content-Security-Policy': "default-src 'self'; script-src 'self' https://js.stripe.com https://cdn.jsdelivr.net https://kit.fontawesome.com https://cdnjs.cloudflare.com; style-src 'self' https://cdn.jsdelivr.net https://kit.fontawesome.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com; font-src 'self' https://kit.fontawesome.com https://ka-f.fontawesome.com https://cdnjs.cloudflare.com; connect-src 'self' http://localhost:3001 http://localhost:3002 http://localhost:3003 http://localhost:3004 http://localhost:5100; img-src 'self' data:; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; upgrade-insecure-requests;",
      // Fixing the Missing Anti-clickjacking Header issue
      'X-Frame-Options': 'DENY',
      //X-Content-Type-Options Header Missing
      'X-Content-Type-Options': 'nosniff',
    },
  },
})