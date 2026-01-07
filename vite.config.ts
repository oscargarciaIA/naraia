import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
      'process.env.REACT_APP_AGENT_API_URL': JSON.stringify(env.REACT_APP_AGENT_API_URL || '')
    },
    server: {
      host: '0.0.0.0', 
      strictPort: true,
      port: 3000,
      watch: {
        usePolling: true 
      }
    }
  };
});