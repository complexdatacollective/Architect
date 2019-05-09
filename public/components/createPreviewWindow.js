const { BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const log = require('./log');

global.previewWindow = null;

function getAppUrl() {
  if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_NC_DEV_SERVER_PORT) {
    const appUrl = url.format({
      host: `localhost:${process.env.WEBPACK_NC_DEV_SERVER_PORT}/`,
      protocol: 'http',
    });

    log.info('appUrl host:', appUrl);

    return appUrl;
  }

  const appUrl = url.format({
    pathname: path.join(__dirname, '../network-canvas/', 'index.html'),
    protocol: 'file:',
  });

  log.info('appUrl path: ', appUrl);

  return appUrl;
}

function createWindow() {
  if (global.previewWindow) { return Promise.resolve(global.previewWindow); }

  return new Promise((resolve) => {
    // Create the browser window.
    const windowParameters = Object.assign({
      width: 1440,
      height: 900,
      minWidth: 1280,
      minHeight: 800,
      center: true,
      title: 'Network Canvas Preview',
      closable: false,
      // webPreferences: {
      //   partition: null,
      // },
      // show: false,
    });

    global.previewWindow = new BrowserWindow(windowParameters);

    global.previewWindow.webContents.on('new-window', (evt) => {
      // A user may have tried to open a new window (shift|cmd-click); ignore action
      evt.preventDefault();
    });

    // For now, any navigation off the SPA is unneeded
    global.previewWindow.webContents.on('will-navigate', (evt) => {
      evt.preventDefault();
    });

    // global.previewWindow.on('closed', () => {
    //   // Dereference the window object, usually you would store windows
    //   // in an array if your app supports multi windows, this is the time
    //   // when you should delete the corresponding element.
    //   global.previewWindow = null;
    // });

    global.previewWindow.on('close', (e) => {
      e.preventDefault();

      global.previewWindow.hide();

      return false;
    });

    global.previewWindow.webContents.on('did-finish-load', () => resolve(global.previewWindow));

    global.previewWindow.loadURL(getAppUrl());

    if (process.env.NODE_ENV === 'development') {
      global.previewWindow.openDevTools();
    }
  });
}

const createPreviewWindow = () =>
  createWindow()
    .then(window => ({
      window,
      loadIndex: () => {
        window.loadURL(getAppUrl());
      },
      webContents: window.webContents,
      send: (...args) => window.webContents.send(...args),
      show: () => window.show(),
      hide: () => window.hide(),
    }));

module.exports = createPreviewWindow;
