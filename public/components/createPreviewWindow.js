const { BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');
const log = require('./log');
const { dispatch, actionCreators } = require('./actions');

global.previewWindow = null;

let settings = {
  width: 1024,
  height: 768,
  scale: 1,
};

const windowParameters = {
  resizable: false,
  center: true,
  show: false,
  width: settings.width,
  height: settings.height,
};

const setSize = (window, options) => {
  // TODO: Be clever and get screen size?
  const scale = options.scale || settings.scale;
  const width = options.width || settings.width;
  const height = options.height || settings.height;

  const adjustedWidth = Math.floor(width * scale);
  const adjustedHeight = Math.floor(height * scale);

  dispatch(window.webContents, actionCreators.setInterfaceScale(scale));
  window.setSize(adjustedWidth, adjustedHeight);

  settings = {
    ...settings,
    width,
    height,
    scale,
  };
};

const getPreviewMenu = (window) => {
  const menu = [
    {
      label: 'Device',
      submenu: [
        {
          label: 'iPad (1024x768)',
          click: () => { setSize(window, { width: 1024, height: 768 }); },
        },
        {
          label: 'iPad Pro (1336x1024)',
          click: () => { setSize(window, { width: 1336, height: 1024 }); },
        },
        {
          label: 'Pixel C (1280x900)',
          click: () => { setSize(window, { width: 1280, height: 900 }); },
        },
        {
          label: 'Chromebook (1280x800)',
          click: () => { setSize(window, { width: 1280, height: 800 }); },
        },
        {
          label: 'Microsoft Surface Device',
          click: () => { setSize(window, { width: 1500, height: 1000 }); },
        },
        {
          label: 'Apple Laptop (1440x900)',
          click: () => { setSize(window, { width: 1440, height: 900 }); },
        },
        {
          label: 'Widescreen laptop (1280x720)',
          click: () => { setSize(window, { width: 1280, height: 720 }); },
        },
      ],
    },
    {
      label: 'Scale',
      submenu: [
        {
          label: '0.25 x',
          click: () => { setSize(window, { scale: 0.25 }); },
        },
        {
          label: '0.5 x',
          click: () => { setSize(window, { scale: 0.5 }); },
        },
        {
          label: '0.75 x',
          click: () => { setSize(window, { scale: 0.75 }); },
        },
        {
          label: '1 x',
          click: () => { setSize(window, { scale: 1 }); },
        },
        {
          label: '1.25 x',
          click: () => { setSize(window, { scale: 1.25 }); },
        },
        {
          label: '1.5 x',
          click: () => { setSize(window, { scale: 1.5 }); },
        },
      ],
    },
    {
      label: 'Develop',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
      ],
    },
  ];

  const appMenu = [
    {
      label: 'Refresh',
      click: () => {
        dispatch(window.webContents, actionCreators.refreshPreview());
      },
    },
    {
      label: 'Close',
      click: () => { window.hide(); },
    },
  ];

  if (process.platform !== 'darwin') {
    // Use File> menu for Windows
    menu[0].submenu.concat(appMenu);
  } else {
    // Use "App" menu for OS X
    menu.unshift({
      submenu: appMenu,
    });
  }

  return menu;
};

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
    global.previewWindow = new BrowserWindow(windowParameters);

    const previewMenu = Menu.buildFromTemplate(getPreviewMenu(global.previewWindow));

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

    global.previewWindow.on('focus', () => {
      Menu.setApplicationMenu(previewMenu);
    });

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
