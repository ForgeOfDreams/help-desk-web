import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

const srcDir = fileURLToPath(new URL('./src', import.meta.url));
const appDir = fileURLToPath(new URL('./src/app', import.meta.url));
const stylesDir = fileURLToPath(new URL('./src/shared/styles', import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyTarget =
    process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'https://localhost';

  return {
    plugins: [react()],
    resolve: {
      // Keep Vite's resolution in sync with compilerOptions.paths in tsconfig.app.json.
      alias: [
        { find: /^@app(?=\/|$)/, replacement: appDir },
        { find: /^@styles(?=\/|$)/, replacement: stylesDir },
        { find: /^@(?=\/|$)/, replacement: srcDir },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: false,
          secure: false,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      strictPort: true,
    },
  };
});
