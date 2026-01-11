import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';

// Copy directory recursively
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

// Plugin to copy main process files instead of bundling
function copyMainProcess() {
  return {
    name: 'copy-main-process',
    buildStart() {
      const srcDir = resolve(__dirname, 'public');
      const destDir = resolve(__dirname, 'dist/main');

      // Copy electron-starter.js as index.js
      mkdirSync(destDir, { recursive: true });
      copyFileSync(resolve(srcDir, 'electron-starter.js'), resolve(destDir, 'index.js'));

      // Copy components directory
      if (existsSync(resolve(srcDir, 'components'))) {
        copyDir(resolve(srcDir, 'components'), resolve(destDir, 'components'));
      }

      // Copy preload directory
      if (existsSync(resolve(srcDir, 'preload'))) {
        copyDir(resolve(srcDir, 'preload'), resolve(destDir, 'preload'));
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
      outDir: 'dist/main/preload',
      rollupOptions: {
        input: {
          appPreload: resolve(__dirname, 'public/preload/appPreload.js'),
          summaryPreload: resolve(__dirname, 'public/preload/summaryPreload.js'),
        },
      },
    },
  },
  renderer: {
    root: '.',
    build: {
      outDir: 'dist/renderer',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
        },
      },
    },
    plugins: [react()],
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
      loader: 'jsx',
      include: /src\/.*\.js$/,
      exclude: [],
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
          includePaths: [resolve(__dirname, 'src/styles')],
        },
      },
    },
    server: {
      port: 3003,
    },
  },
});
