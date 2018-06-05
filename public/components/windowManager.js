const { BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');
const mainMenu = require('./mainMenu');

const isMacOS = () => process.platform === 'darwin';

const titlebarParameters = isMacOS() ? { titleBarStyle: 'hidden', frame: false } : {};

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

function setApplicationMenu(window) {
  return new Promise((resolve) => {
    const appMenu = Menu.buildFromTemplate(mainMenu(window));
    Menu.setApplicationMenu(appMenu);

    resolve(window);
  });
}

function loadApp(window) {
  return new Promise((resolve) => {
    window.webContents.on('did-finish-load', () => resolve(window));

    window.loadURL(getAppUrl());
  });
}

function createWindow() {
  return new Promise((resolve) => {
    // Create the browser window.
    const windowParameters = Object.assign({
      width: 1440,
      height: 900,
      minWidth: 1280,
      minHeight: 800,
      center: true,
      title: 'Network Canvas Architect',

    }, titlebarParameters);

    const mainWindow = new BrowserWindow(windowParameters);

    if (process.env.NODE_ENV === 'development') {
      mainWindow.openDevTools();
    }

    resolve(mainWindow);
  });
}

const windowManager = {
  window: null,
  get hasWindow() { return !!this.window; },
  getWindow: function getWindow() {
    if (this.window) { return Promise.resolve(this.window); }

    console.log('make window');

    return createWindow()
      .then((window) => {
        this.window = window;

        this.window.on('closed', () => {
          // Dereference the window object, usually you would store windows
          // in an array if your app supports multi windows, this is the time
          // when you should delete the corresponding element.
          this.window = null;
        });

        return window;
      })
      .then(setApplicationMenu)
      .then(loadApp);
  },
};

module.exports = windowManager;
