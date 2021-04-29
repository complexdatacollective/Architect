const { BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const log = require('./log');

const windowParameters = {
  center: true,
  enableLargerThanScreen: true,
  height: 768,
  // resizeable:
  // This doesn't work as expected. It stops the user from
  // manually resizing the window, but also seems to prevent
  // setSize from *reducing* the window size. Currently
  // setContentSize doesn't seem to have this limitation and
  // is a better fit for purpose.
  resizable: false,
  show: false,
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

function createPrintableSummaryWindow() {
  return new Promise((resolve) => {
    if (global.previewWindow) { Promise.resolve(global.previewWindow); }

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

    global.previewWindow.on('close', (e) => {
      if (!global.quit) {
        e.preventDefault();

        global.previewWindow.hide();

        return false;
      }

      return true;
    });

    if (process.env.SHOW_PREVIEW_DEV_TOOLS) {
      global.previewWindow.openDevTools();
    }

    global.previewWindow.showIndex = () => {
      global.previewWindow.loadURL(getAppUrl());
    };

    global.previewWindow.webContents.on('did-finish-load', () =>
      resolve(global.previewWindow),
    );

    global.previewWindow.loadURL(getAppUrl());
  });
}

module.exports = createPrintableSummaryWindow;
