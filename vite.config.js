import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase' // Permite usar styles.loginContainer
    }
  },
  resolve: {
    alias: {
      '@': '/src' // Para poder usar importaciones como '@/assets/...'
    }
  }
});
