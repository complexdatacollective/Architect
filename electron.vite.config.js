import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';

/**
 * Copy directory recursively
 */
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Plugin to copy main process CommonJS files to dist.
 * The main process uses CommonJS and native modules that don't bundle well,
 * so we copy them directly instead of bundling.
 */
function copyMainProcess() {
  return {
    name: 'copy-main-process',
    closeBundle() {
      const srcDir = resolve(__dirname, 'public');
      const destDir = resolve(__dirname, 'dist/main');

      // Copy electron-starter.js as index.js (entry point)
      mkdirSync(destDir, { recursive: true });
      copyFileSync(
        resolve(srcDir, 'electron-starter.js'),
        resolve(destDir, 'index.js')
      );

      // Copy components directory
      if (existsSync(resolve(srcDir, 'components'))) {
        copyDir(resolve(srcDir, 'components'), resolve(destDir, 'components'));
      }

      // Copy icons directory
      if (existsSync(resolve(srcDir, 'icons'))) {
        copyDir(resolve(srcDir, 'icons'), resolve(destDir, 'icons'));
      }
    },
  };
}

export default defineConfig({
  main: {
    plugins: [copyMainProcess()],
    build: {
      outDir: 'dist/main',
      emptyOutDir: false,
      rollupOptions: {
        input: resolve(__dirname, 'public/electron-starter.js'),
        output: {
          entryFileNames: '_dummy.js',
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: {
          app: resolve(__dirname, 'public/preload/appPreload.js'),
          summary: resolve(__dirname, 'public/preload/summaryPreload.js'),
        },
      },
    },
  },
  renderer: {
    root: '.',
    // Note: module.hot shim is injected via index.html to avoid breaking bundled code
    build: {
      outDir: 'dist/renderer',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
      },
    },
    plugins: [
      react({
        include: ['src/**/*.js', 'src/**/*.jsx', '**/*.js', '**/*.jsx'],
        babel: {
          babelrc: false,
          configFile: false,
          presets: [
            ['@babel/preset-react', { runtime: 'automatic' }],
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@app': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@selectors': resolve(__dirname, 'src/selectors'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@modules': resolve(__dirname, 'src/ducks/modules'),
        '@utils': resolve(__dirname, 'src/utils'),
      },
    },
    esbuild: {
      jsx: 'automatic',
      jsxImportSource: 'react',
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: [
            'import',
            'global-builtin',
            'legacy-js-api',
            'color-functions',
            'mixed-decls',
            'slash-div',
            'if-function',
          ],
          loadPaths: [resolve(__dirname, 'src/styles')],
        },
      },
    },
    server: {
      port: 3003,
    },
  },
});
