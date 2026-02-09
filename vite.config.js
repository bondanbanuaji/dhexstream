import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/dhexstream/' : '/dhexstream/dist/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'gsap', 'lenis']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      // Proxy all /dhexstream/api.php requests to Apache
      '/dhexstream/api.php': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false
      }
    }
  }
}))
