import { joinPathFragments } from '@nx/devkit';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  cacheDir: '../../../node_modules/.vite/ui-icons',

  plugins: [
    dts({
      entryRoot: 'src',
      tsConfigFilePath: joinPathFragments(__dirname, 'tsconfig.lib.json'),
      skipDiagnostics: true,
    }),

    viteTsConfigPaths({
      root: '../../../',
    }),

    Icons({
      autoInstall: true,
      compiler: 'raw',
      defaultStyle: 'display:block;margin:auto;width:100%;height:100%;',
      scale: 1,
    }),
  ],

  build: {
    outDir: '../../../dist/packages/ui/icons',
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    lib: {
      entry: 'src/index.ts',
      name: 'icons',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
    },
  },
});
