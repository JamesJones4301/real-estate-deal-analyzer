 import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/real-estate-deal-analyzer/',
  build: {
    outDir: 'dist'
  }
})