const { ipcMain, app } = require('electron');
const path = require('path');
const windowManager = require('./windowManager');
const registerProtocolProtocol = require('./protocolProtocol').registerProtocolProtocol;

const appManager = {
  openFileWhenReady: null,
  init: function init() {
    ipcMain.on('GET_ARGF', (event) => {
      if (process.platform === 'win32' && process.argv.length >= 2) {
        const filePath = process.argv[1];
        if (path.extname(filePath) === '.netcanvas') {
          console.log('.netcanvas found in argv', JSON.stringify({ argv: process.argv }, null, 2));
          event.sender.send('OPEN_FILE', filePath);
        }
      }

      if (this.openFileWhenReady) {
        event.sender.send('OPEN_FILE', this.openFileWhenReady);
        this.openFileWhenReady = null;
      }
    });
  },
  restore: function restore() {
    if (!app.isReady()) { return; }
    windowManager.getWindow()
      .then((window) => {
        if (window.isMinimized()) {
          window.restore();
        }

        window.focus();
      });
  },
  openFile: function openFile(fileToOpen) {
    if (!app.isReady()) {
      // defer action
      this.openFileWhenReady = fileToOpen;
    } else {
      windowManager.getWindow()
        .then((window) => {
          window.webContents.send('OPEN_FILE', fileToOpen);
        });
      this.openFileWhenReady = null;
    }
  },
  start: function start() {
    registerProtocolProtocol();

    return windowManager
      .getWindow();
  },
};

module.exports = appManager;
