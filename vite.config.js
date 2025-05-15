import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/relation-graph-react/',
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Supprime les console.log en production
        drop_debugger: true  // Supprime les debugger
      },
      format: {
        comments: false  // Supprime les commentaires
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@react-three/fiber', '@react-three/drei']
        }
      }
    }
  }
})
