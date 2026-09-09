import path from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

import { disableAnimationsSetup } from '@codaco/vitest-config/legacy/setup-path';

const configDirectory = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      fileURLToPath(import.meta.resolve(disableAnimationsSetup)),
      './config/vitest/setup.js',
    ],
    include: ['src/**/*.test.{js,jsx}', 'src/**/__tests__/**/*.{js,jsx}'],
    exclude: [
      'node_modules',
      'network-canvas',
      'dist',
      'src/__tests__/testHelpers.js',
      'src/utils/netcanvasFile/__tests__/helpers.js',
    ],
    css: true,
    server: {
      deps: {
        inline: [/@codaco\/ui/],
      },
    },
  },
  resolve: {
    alias: {
      '@app': path.resolve(configDirectory, 'src'),
      '@components': path.resolve(configDirectory, 'src/components'),
      '@selectors': path.resolve(configDirectory, 'src/selectors'),
      '@hooks': path.resolve(configDirectory, 'src/hooks'),
      '@modules': path.resolve(configDirectory, 'src/ducks/modules'),
      '@utils': path.resolve(configDirectory, 'src/utils'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
});
