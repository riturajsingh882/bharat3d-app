import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api/geoapify': {
        target: 'https://maps.geoapify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/geoapify/, ''),
      },
    },
  },
})
