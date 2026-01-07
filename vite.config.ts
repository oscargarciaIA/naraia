import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo (development/production)
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      // Esto permite que el código frontend use `process.env.API_KEY`
      // sin necesidad de refactorizar todo a `import.meta.env`
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY)
    },
    server: {
      host: true, // Necesario para Docker mapping
      strictPort: true,
      port: 3000,
      watch: {
        usePolling: true // Necesario para Windows/WSL file watching
      }
    }
  };
});