const { BrowserWindow, Menu } = require('electron');
const url = require('url');
const path = require('path');
const log = require('./log');
const { dispatch, actionCreators } = require('./actions');

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
          label: 'Pixel C (1280x900)',
          click: () => { setSize(window, { width: 1280, height: 900 }); },
        },
      ],
    },
    {
      label: 'Scale',
      submenu: [
        {
          label: '0.25x',
          click: () => { setSize(window, { scale: 0.25 }); },
        },
        {
          label: '0.5x',
          click: () => { setSize(window, { scale: 0.5 }); },
        },
        {
          label: '1x',
          click: () => { setSize(window, { scale: 1 }); },
        },
        {
          label: '2x',
          click: () => { setSize(window, { scale: 2 }); },
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

global.previewWindow = null;

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

    global.previewWindow.on('focus', () => {
      Menu.setApplicationMenu(previewMenu);
    });

    global.previewWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      global.previewWindow = null;
    });

    global.previewWindow.webContents.on('did-finish-load', () => resolve(global.previewWindow));

    global.previewWindow.loadURL(getAppUrl());

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
  openPreview: function openPreview({ protocol, path: workingPath, stageIndex }) {
    this.getWindow().then(
      (window) => {
        log.info('OPEN_PREVIEW', protocol.name, workingPath, stageIndex);

        window.webContents.send('ACTION', {
          type: 'PREVIEW/OPEN_PREVIEW',
          protocol,
          path: workingPath,
          stageIndex,
        });
        window.show();
        window.moveTop();
      },
    );
  },
  closePreview: function closePreview() {
    this.getWindow().then(
      (window) => {
        log.info('HIDE_PREVIEW');
        window.hide();
      },
    );
  },
};

module.exports = windowManager;
