import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/ui",
  server: {
    watch: {
      usePolling: true, // Usa polling per file system watcher (utile in ambienti con file system virtuale)
    },

    proxy: {
      '/API': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false
      },
      '/api/dcc': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/api/sensors': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/api/anagrafica': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/api/public': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/api/calibrations': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/me': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },

    host: "0.0.0.0",
    hmr: true, // Abilita Hot Module Replacement
    strictPort: true,
    port: 5173, // you can replace this port with any port
  }
})
