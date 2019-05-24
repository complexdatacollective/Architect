const { ipcMain, app, BrowserWindow } = require('electron');
const log = require('./log');
const path = require('path');
const appWindowManager = require('./appWindowManager');
const registerAssetProtocol = require('./assetProtocol').registerProtocol;

function getFileFromArgs(argv) {
  if (argv.length >= 2) {
    const filePath = argv[1];
    if (path.extname(filePath) === '.netcanvas') {
      log.info('.netcanvas found in argv', JSON.stringify({ argv }, null, 2));
      return filePath;
    }
  }
  return null;
}

const appManager = {
  openFileWhenReady: null,
  init: function init() {
    ipcMain.on('GET_ARGF', (event) => {
      if (process.platform === 'win32') {
        const filePath = getFileFromArgs(process.argv);
        if (filePath) {
          event.sender.send('OPEN_FILE', filePath);
        }
      }

      if (this.openFileWhenReady) {
        event.sender.send('OPEN_FILE', this.openFileWhenReady);
        this.openFileWhenReady = null;
      }
    });

    ipcMain.on('QUIT', () => {
      global.quit = true;
      app.quit();
      global.quit = false;
    });
  },
  loadDevTools: () => {
    const extensions = process.env.NC_DEVTOOLS_EXTENSION_PATH;
    if (process.env.NODE_ENV !== 'development' || !extensions) { return; }
    try {
      log.info(extensions);
      extensions.split(';').forEach(
        filepath =>
          BrowserWindow.addDevToolsExtension(filepath),
      );
    } catch (err) {
      /* eslint-disable no-console */
      log.warn(err);
      log.warn('A Chrome dev tools extension failed to load. If the extension has upgraded, update your NC_DEVTOOLS_EXTENSION_PATH:');
      log.warn(process.env.NC_DEVTOOLS_EXTENSION_PATH);
      /* eslint-enable */
    }
  },
  openFileFromArgs: function openFileFromArgs(argv) {
    return this.restore()
      .then((window) => {
        if (process.platform === 'win32') {
          const filePath = getFileFromArgs(argv);
          if (filePath) {
            window.webContents.send('OPEN_FILE', filePath);
          }
        }

        return window;
      });
  },
  restore: function restore() {
    if (!app.isReady()) { return Promise.reject(); }

    return appWindowManager.getWindow()
      .then((window) => {
        if (window.isMinimized()) {
          window.restore();
        }

        window.focus();

        return window;
      });
  },
  openFile: function openFile(fileToOpen) {
    if (!app.isReady()) {
      // defer action
      this.openFileWhenReady = fileToOpen;
    } else {
      appWindowManager.getWindow()
        .then((window) => {
          window.webContents.send('OPEN_FILE', fileToOpen);
        });
      this.openFileWhenReady = null;
    }
  },
  start: function start() {
    registerAssetProtocol();

    return appWindowManager
      .getWindow();
  },
};

module.exports = appManager;
