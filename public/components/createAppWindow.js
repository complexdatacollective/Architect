const { BrowserWindow, Menu, MenuItem } = require('electron');
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
      // hash: '/summary',
    });

    log.info('appUrl [host]', appUrl);

    return appUrl;
  }

  const appUrl = url.format({
    pathname: path.join(__dirname, '../', 'index.html'),
    protocol: 'file:',
    hash: '/summary',
  });

  log.info('appUrl [path]', appUrl);

  return appUrl;
}

function createAppWindow() {
  return new Promise((resolve) => {
    if (global.appWindow) { Promise.resolve(global.appWindow); }

    // Create the browser window.
    const windowParameters = Object.assign({
      width: 1440,
      height: 900,
      minWidth: 1280,
      minHeight: 800,
      center: true,
      title: 'Network Canvas Architect',
      show: true,
      webPreferences: {
        nodeIntegration: true,
      },
    }, titlebarParameters);

    global.appWindow = new BrowserWindow(windowParameters);

    // Enable right click menu for spelling suggestions
    global.appWindow.webContents.on('context-menu', (_, params) => {
      const menu = new Menu();

      // Add each spelling suggestion
      params.dictionarySuggestions.forEach((suggestion) => {
        menu.append(new MenuItem({
          label: suggestion,
          click: () => global.appWindow.webContents.replaceMisspelling(suggestion),
        }));
      });

      // Allow users to add the misspelled word to the dictionary
      if (params.misspelledWord) {
        menu.append(
          new MenuItem({
            label: 'Add to dictionary',
            // eslint-disable-next-line max-len
            click: () => global.appWindow.webContents.session.addWordToSpellCheckerDictionary(params.misspelledWord),
          }),
        );
      }

      menu.popup();
    });

    global.appWindow.webContents.on('new-window', (evt) => {
      // A user may have tried to open a new window (shift|cmd-click); ignore action
      evt.preventDefault();
    });

    // For now, any navigation off the SPA is unneeded
    global.appWindow.webContents.on('will-navigate', (evt) => {
      evt.preventDefault();
    });

    global.appWindow.on('closed', () => {
      global.appWindow = null;
    });

    // global.appWindow.once('ready-to-show', () => {
    //   global.appWindow.show();
    // });

    global.appWindow.webContents.on('did-finish-load', () => resolve(global.appWindow));

    global.appWindow.loadURL(getAppUrl());

    if (process.env.NODE_ENV === 'development') {
      global.appWindow.openDevTools();
    }
  });
}

module.exports = createAppWindow;
