import Unfonts from 'unplugin-fonts/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { VitePWA as vitePWA } from 'vite-plugin-pwa';
import viteTsConfigPaths from 'vite-tsconfig-paths';

import project from './project.json';

import type { ManifestOptions } from 'vite-plugin-pwa';
import type { GenerateSWOptions } from 'workbox-build';

const DIST_PATH = project.targets.build.options.outputPath;

const serviceWorker: Partial<GenerateSWOptions> = {
  swDest: `${DIST_PATH}/sw.js`,
  skipWaiting: true,
  // clientsClaim: true,
  globDirectory: DIST_PATH,
  globPatterns: ['**/*.{html,js,css,woff,png,ico,svg,webp}'],
};
const manifestJson: Partial<ManifestOptions> = {
  /* url */
  scope: '/',
  start_url: '/?pwa',
  id: 'persianpart',
  lang: 'fa-IR',
  screenshots: [
    {
      src: './public/screenshots/1.png',
      sizes: '1081x2340',
      type: 'image/png',
    },
    {
      src: './public/screenshots/2.png',
      sizes: '1081x2340',
      type: 'image/png',
    },
    {
      src: './public/screenshots/3.png',
      sizes: '1081x2340',
      type: 'image/png',
    },
    {
      src: './public/screenshots/4.png',
      sizes: '1081x2340',
      type: 'image/png',
    },
    {
      src: './public/screenshots/5.png',
      sizes: '1081x2340',
      type: 'image/png',
    },
  ],
  shortcuts: [
    {
      name: 'ثبت سفارش',
      url: '/',
    },
    {
      name: 'حساب کاربری',
      url: '/user',
    },
  ],

  /* info */
  name: 'وب اپلیکیشن پرشین پارت',
  short_name: 'پرشین پارت',
  description: 'وب اپلیکیشن فروشگاه بازرگانی پرشین پارت',

  /* screen */
  display: 'standalone',
  orientation: 'portrait',
  dir: 'rtl',

  /* theming */
  theme_color: '#fff',
  background_color: '#fff',

  /* icons */
  icons: [
    {
      src: '/icon-192-maskable.png',
      type: 'image/png',
      sizes: '192x192',
      purpose: 'maskable',
    },
    {
      src: '/icon-512-maskable.png',
      type: 'image/png',
      sizes: '512x512',
      purpose: 'maskable',
    },
    { src: '/favicon.ico', type: 'image/x-icon', sizes: '32x32' },
    {
      src: '/icon-192.png',
      type: 'image/png',
      sizes: '192x192',
    },
    {
      src: '/icon-512.png',
      type: 'image/png',
      sizes: '512x512',
    },
  ],
};

export default defineConfig({
  server: {
    fs: {
      allow: ['..', '../../node_modules/'],
    },
    watch: {
      ignored: ['*', '!./**/*'],
    },
  },

  build: {
    outDir: DIST_PATH,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  plugins: [
    viteTsConfigPaths({
      root: '../../',
      ignoreConfigErrors: true,
    }),

    Icons({
      autoInstall: true,
      compiler: 'raw',
    }),

    Unfonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@300',
            defer: true,
          },
        ],
        display: 'swap',
        injectTo: 'head-prepend',
        preconnect: true,
      },
      fontsource: {
        families: ['Vazirmatn'],
      },
    }),

    vitePWA({
      workbox: serviceWorker,
      manifest: manifestJson,
      mode: 'production',
      outDir: DIST_PATH,
    }),
  ],
});
