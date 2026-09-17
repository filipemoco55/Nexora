import { defineConfig } from 'vite';
import { resolve } from 'path';

// Vite Multi-Page Application (MPA) Configuration
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        servicos: resolve(__dirname, 'servicos.html'),
        precos: resolve(__dirname, 'precos.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        contacto: resolve(__dirname, 'contacto.html'),
        login: resolve(__dirname, 'login.html'),
        privacidade: resolve(__dirname, 'privacidade.html'),
        termos: resolve(__dirname, 'termos.html'),
        dashboard: resolve(__dirname, 'dashboard.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
