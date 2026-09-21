import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function createPwaManifest(appName: string) {
  return {
    id: '/',
    name: appName,
    short_name: appName.length <= 18 ? appName : 'VLB3 Remote',
    description: 'Portale clienti per il monitoraggio e il controllo remoto degli impianti VLB3.',
    lang: 'it-IT',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'any',
    background_color: '#07100d',
    theme_color: '#07100d',
    categories: ['business', 'utilities'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

function pwaManifestPlugin(appName: string): Plugin {
  const source = JSON.stringify(createPwaManifest(appName), null, 2);

  return {
    name: 'vlb3-pwa-manifest',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.split('?')[0] !== '/manifest.webmanifest') {
          next();
          return;
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
        response.setHeader('Cache-Control', 'no-cache');
        response.end(source);
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const appName = env.VITE_APP_NAME || 'VLB3 Remote';

  return {
    plugins: [react(), pwaManifestPlugin(appName)],
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  };
});
