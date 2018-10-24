const { app, BrowserWindow, shell } = require('electron');
const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url');
const log = require('electron-log');

const isMacOS = () => false; //os.platform() === 'darwin';

const titlebarParameters = isMacOS() ? { titleBarStyle: 'hidden', frame: false } : {};

const windowParameters = Object.assign({
  width: 1440,
  height: 900,
  minWidth: 1280,
  minHeight: 800,
  center: true,
  title: 'Preview Protocol',

}, titlebarParameters);

log.info('App starting...');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const appUrl = (function getAppUrl() {
  if (process.env.NODE_ENV === 'development' && process.env.WEBPACK_DEV_SERVER_PORT) {
    return url.format({
      host: `localhost:${process.env.WEBPACK_DEV_SERVER_PORT}/`,
      protocol: 'http',
    });
  }
  return url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
  });
}());

function createPreview({ protocol, path, stageIndex = 0 }) {
  // Create the browser window.
  mainWindow = new BrowserWindow(windowParameters);

  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.webContents.send('OPEN_PREVIEW', { protocol, path, stageIndex });
  });

  mainWindow.loadURL(appUrl);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Open any new windows in default browser (not electron)
  mainWindow.webContents.on('new-window', (evt, newUrl) => {
    evt.preventDefault();
    shell.openExternal(newUrl);
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform === 'darwin') {
  //   app.quit();
  // }
  app.quit();
});

module.exports = createPreview;
