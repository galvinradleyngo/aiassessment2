import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Keep repo subpath for GitHub Pages builds, but serve from root in local dev/preview.
  base: command === 'build' ? '/aiassessment2/' : '/',
}))
