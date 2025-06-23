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
        '~/*': './src/renderer/*',
      },
    },
  },
};
