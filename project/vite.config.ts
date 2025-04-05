import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://www.themealdb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/indian-food': {
        target: 'https://indian-food-db.herokuapp.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/indian-food/, ''),
      },
      '/recipes': {
        target: 'https://recipes-api3.p.rapidapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/recipes/, ''),
        headers: {
          'x-rapidapi-host': 'recipes-api3.p.rapidapi.com',
          'x-rapidapi-key': '0ced939ec0mshcdf737fc4b7a1cdp1b122djsn64c9129a8daa'
        }
      }
    },
  },
});