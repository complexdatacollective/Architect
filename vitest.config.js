import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./config/vitest/setup.js'],
    include: ['src/**/*.test.{js,jsx}', 'src/**/__tests__/**/*.{js,jsx}'],
    exclude: ['node_modules', 'network-canvas', 'dist'],
    css: true,
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@selectors': path.resolve(__dirname, 'src/selectors'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@modules': path.resolve(__dirname, 'src/ducks/modules'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
});
