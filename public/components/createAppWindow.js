const { BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const log = require('./log');

const isMacOS = () => process.platform === 'darwin';

const titlebarParameters = isMacOS() ? { titleBarStyle: 'hidden', frame: false } : {};

global.appWindow = null;

function getAppUrl() {
  if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER_PORT) {
    const appUrl = url.format({
      host: `localhost:${process.env.WEBPACK_DEV_SERVER_PORT}/`,
      protocol: 'http',
    });

    log.info('appUrl host:', appUrl);

    return appUrl;
  }

  const appUrl = url.format({
    pathname: path.join(__dirname, '../', 'index.html'),
    protocol: 'file:',
  });

  log.info('appUrl path: ', appUrl);

  return appUrl;
}

function createAppWindow() {
  return new Promise((resolve) => {
    // Create the browser window.
    const windowParameters = Object.assign({
      width: 1440,
      height: 900,
      minWidth: 1280,
      minHeight: 800,
      center: true,
      title: 'Network Canvas Architect',
      show: false,

    }, titlebarParameters);

    const appWindow = new BrowserWindow(windowParameters);

    global.quit = false;

    appWindow.webContents.on('new-window', (evt) => {
      // A user may have tried to open a new window (shift|cmd-click); ignore action
      evt.preventDefault();
    });

    // For now, any navigation off the SPA is unneeded
    appWindow.webContents.on('will-navigate', (evt) => {
      evt.preventDefault();
    });

    appWindow.on('close', (e) => {
      // if (!global.quit) {
      //   log.info('prevent close');
      //   e.preventDefault();
      //   appWindow.webContents.send('CONFIRM_CLOSE');
      // }
    });

    appWindow.once('ready-to-show', () => {
      appWindow.show();
    });

    appWindow.webContents.on('did-finish-load', () => resolve(appWindow));

    appWindow.loadURL(getAppUrl());

    if (process.env.NODE_ENV === 'development') {
      appWindow.openDevTools();
    }
  });
}

module.exports = createAppWindow;
