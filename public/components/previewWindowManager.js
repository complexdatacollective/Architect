const { BrowserWindow } = require('electron');
const log = require('./log');
const url = require('url');
const path = require('path');

const windowParameters = {
  width: 1024,
  height: 768,
  resizable: false,
  center: true,
  frame: false,
  show: false,
  alwaysOnTop: true,
};

global.previewWindow = null;

function getAppUrl() {
  if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER_PORT) {
    return url.format({
      host: `localhost:${process.env.WEBPACK_DEV_SERVER_PORT}/`,
      protocol: 'http',
    });
  }

  return url.format({
    pathname: path.join(__dirname, '../', 'index.html'),
    protocol: 'file:',
  });
}

function createWindow() {
  if (global.previewWindow) { return Promise.resolve(global.previewWindow); }

  return new Promise((resolve) => {
    // Create the browser window.
    global.previewWindow = new BrowserWindow(windowParameters);

    global.previewWindow.webContents.on('new-window', (evt) => {
      // A user may have tried to open a new window (shift|cmd-click); ignore action
      evt.preventDefault();
    });

    // For now, any navigation off the SPA is unneeded
    global.previewWindow.webContents.on('will-navigate', (evt) => {
      evt.preventDefault();
    });

    global.previewWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      global.previewWindow = null;
    });

    global.previewWindow.webContents.on('did-finish-load', () => resolve(global.previewWindow));

    global.previewWindow.loadURL(getAppUrl());
  });
}

const windowManager = {
  get hasWindow() { return !!global.appWindow; },
  getWindow: function getWindow() {
    return createWindow();
  },
  openPreview: function openPreview({ protocol, path: workingPath, stageIndex }) {
    this.getWindow().then(
      (window) => {
        log.info('OPEN_PREVIEW', protocol.name, workingPath, stageIndex);
        window.webContents.send('OPEN_PREVIEW', { protocol, path: workingPath, stageIndex });
        window.show();
      },
    );
  },
};

module.exports = windowManager;
