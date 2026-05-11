import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to '/hyperfeeds-tracker/' if deploying under that repo path on GitHub Pages.
// Override via VITE_BASE env var when needed.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || './',
})
