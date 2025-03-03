import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    watch: {
      usePolling: true, // Usa polling per file system watcher (utile in ambienti con file system virtuale)
    },
    base:"/ui",
    host: "0.0.0.0",
    hmr: true, // Abilita Hot Module Replacement
  }
})
