import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Obtenez l'URL de déploiement de Vercel
const vercelUrl = process.env.VERCEL_URL || '';

// Affichez l'URL dans la console pendant le développement
console.log('Vercel URL:', vercelUrl);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './'
});
