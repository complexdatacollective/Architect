const { BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');
const mainMenu = require('./mainMenu');

const isMacOS = () => process.platform === 'darwin';

const titlebarParameters = isMacOS() ? { titleBarStyle: 'hidden', frame: false } : {};

global.appWindow = null;

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
  if (global.appWindow) { return Promise.resolve(global.appWindow); }

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

    global.appWindow = new BrowserWindow(windowParameters);

    const appMenu = Menu.buildFromTemplate(mainMenu(global.appWindow));
    Menu.setApplicationMenu(appMenu);

    global.appWindow.webContents.on('new-window', (evt) => {
      // A user may have tried to open a new window (shift|cmd-click); ignore action
      evt.preventDefault();
    });

    // For now, any navigation off the SPA is unneeded
    global.appWindow.webContents.on('will-navigate', (evt) => {
      evt.preventDefault();
    });

    global.appWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      global.appWindow = null;
    });

    global.appWindow.once('ready-to-show', () => {
      global.appWindow.show();
    });

    global.appWindow.webContents.on('did-finish-load', () => resolve(global.appWindow));

    global.appWindow.loadURL(getAppUrl());

    if (process.env.NODE_ENV === 'development') {
      global.appWindow.openDevTools();
    }
  });
}

const windowManager = {
  get hasWindow() { return !!global.appWindow; },
  getWindow: function getWindow() {
    return createWindow();
  },
};

module.exports = windowManager;
