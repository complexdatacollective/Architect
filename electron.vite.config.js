/**
 * @type {import('electron-vite').UserConfig}
 */
export default {
  main: {
    // vite config options
  },
  preload: {
    // vite config options
  },
  renderer: {
    // vite config options
    resolve: {
      alias: {
        '@app': './src/renderer',
        '@components': './src/renderer/components',
        '@selectors': './src/renderer/selectors',
        '@hooks': './src/renderer/hooks',
        '@modules': './src/renderer/modules',
        '@utils': './src/renderer/utils',
      },
    },

  }
}