const { BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const log = require('./log');

const windowParameters = {
  center: true,
  enableLargerThanScreen: true,
  height: 768,
  menuBarVisible: false,
  show: true,
  useContentSize: true,
  webPreferences: { nodeIntegration: true },
  width: 1024,
};

function getAppUrl() {
  if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER_PORT) {
    const appUrl = url.format({
      host: `localhost:${process.env.WEBPACK_DEV_SERVER_PORT}/`,
      protocol: 'http',
      hash: 'summary',
    });

    log.info('appUrl [host]', appUrl);

    return appUrl;
  }

  const appUrl = url.format({
    pathname: path.join(__dirname, '../', 'index.html'),
    protocol: 'file:',
    hash: 'summary',
  });

  log.info('appUrl [path]', appUrl);

  return appUrl;
}

function openPrintableSummaryWindow(payload) {
  return new Promise((resolve) => {
    if (global.summaryWindow) {
      global.summaryWindow.close();
    }

    // Create the browser window.
    global.summaryWindow = new BrowserWindow(windowParameters);
    global.summaryWindow.setMenuBarVisibility(false);

    global.summaryWindow.webContents.on('new-window', (evt) => {
      // A user may have tried to open a new window (shift|cmd-click); ignore action
      evt.preventDefault();
    });

    // For now, any navigation off the SPA is unneeded
    global.summaryWindow.webContents.on('will-navigate', (evt) => {
      evt.preventDefault();
    });

    global.summaryWindow.on('close', () => {
      delete global.summaryWindow;
    });

    global.summaryWindow.webContents.on('did-finish-load', () => {
      global.summaryWindow.webContents.send('SUMMARY_DATA', payload);
      resolve(global.summaryWindow);
    });

    global.summaryWindow.loadURL(getAppUrl());
  });
}

module.exports = openPrintableSummaryWindow;
