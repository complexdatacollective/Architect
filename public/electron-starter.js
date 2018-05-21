const { app, BrowserWindow, Menu } = require('electron');
const log = require('electron-log');
const os = require('os');
const path = require('path');
const url = require('url');
const mainMenu = require('./components/mainMenu');
require('./components/updater');
const registerProtocolProtocol = require('./components/protocolProtocol').registerProtocolProtocol;

log.info('App starting...');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let openFile;

function getAppUrl() {
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
}

const isMacOS = () => os.platform() === 'darwin';

const titlebarParameters = isMacOS() ? { titleBarStyle: 'hidden', frame: false } : {};

const windowParameters = Object.assign({
  width: 1440,
  height: 900,
  minWidth: 1280,
  minHeight: 800,
  center: true,
  title: 'Network Canvas Architect',

}, titlebarParameters);

function createWindow() {
  // Create the browser window.
  if (mainWindow) { return; }

  mainWindow = new BrowserWindow(windowParameters);
  mainWindow.maximize();

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools();
  }

  const appMenu = Menu.buildFromTemplate(mainMenu(mainWindow));
  Menu.setApplicationMenu(appMenu);

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.webContents.once('did-finish-load', () => {
    if (openFile) {
      mainWindow.webContents.send('OPEN_FILE', openFile);
      openFile = null;
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(getAppUrl());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  registerProtocolProtocol();
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (!mainWindow) {
    createWindow();
  }
});

app.on('open-file', (env, filePath) => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.webContents.send('OPEN_FILE', filePath);
  } else {
    openFile = filePath;
    if (app.isReady()) {
      createWindow();
    }
    // else: assume app.ready will trigger open window
  }
});
