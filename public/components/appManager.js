const { ipcMain, app, Menu, BrowserWindow } = require('electron');
const log = require('./log');
const path = require('path');
const { openDialog, saveDialog, clearStorageDataDialog } = require('./dialogs');
const mainMenu = require('./mainMenu');
const createPreviewManager = require('./createPreviewManager');
const createAppWindow = require('./createAppWindow');
const registerAssetProtocol = require('./assetProtocol').registerProtocol;

function getFileFromArgs(argv) {
  if (argv.length >= 2) {
    const filePath = argv[1];
    if (path.extname(filePath) === '.netcanvas') {
      log.info('.netcanvas found in argv', JSON.stringify({ argv }, null, 2));
      return filePath;
    }
  }
  return null;
}

class AppManager {
  constructor() {
    this.openFileWhenReady = null;
    this.appWindow = null;
    this.isCreatingWindow = false;

    if (this.makeSingleInstance()) { return; }

    this.initializeListeners();

    app.on('open-file', (event, filePath) => {
      this.openFile(filePath);
    });

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', () => {
      this.initializeMenu();

      registerAssetProtocol();

      this.openWindow();

      createPreviewManager().then(() => {
        log.info('created preview manager');
      });

      app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (process.platform === 'darwin') {
          this.openWindow();
        }
      });
    });
  }

  static loadDevTools() {
    const extensions = process.env.NC_DEVTOOLS_EXTENSION_PATH;
    if (process.env.NODE_ENV !== 'development' || !extensions) { return; }
    try {
      log.info(extensions);
      extensions.split(';').forEach(
        filepath =>
          BrowserWindow.addDevToolsExtension(filepath),
      );
    } catch (err) {
      /* eslint-disable no-console */
      log.warn(err);
      log.warn('A Chrome dev tools extension failed to load. If the extension has upgraded, update your NC_DEVTOOLS_EXTENSION_PATH:');
      log.warn(process.env.NC_DEVTOOLS_EXTENSION_PATH);
      /* eslint-enable */
    }
  }

  makeSingleInstance() {
    const shouldQuit = app.makeSingleInstance((argv) => {
      this.openFileFromArgs(argv);
    });

    if (shouldQuit) {
      app.quit();
    }

    return shouldQuit;
  }

  openFileFromArgs(argv) {
    if (process.platform === 'win32') {
      const filePath = getFileFromArgs(argv);
      if (filePath) {
        this.openFile(filePath);
      }
    }
  }

  // File -> Open
  openFile(fileToOpen) {
    if (!app.isReady()) {
      // defer action
      this.openFileWhenReady = fileToOpen;
    } else {
      this.openWindow()
        .then((window) => {
          window.webContents.send('OPEN_FILE', fileToOpen);
        });
      this.openFileWhenReady = null;
    }
  }

  openWindow() {
    return this.getWindow()
      .then((window) => {
        if (window.isMinimized()) {
          window.restore();
        }

        window.focus();

        return window;
      });
  }

  getWindow() {
    if (!app.isReady()) { return Promise.reject(); }
    if (this.isCreatingWindow) { return Promise.reject(); }

    if (this.appWindow) {
      return Promise.resolve(this.appWindow);
    }

    this.isCreatingWindow = true;

    return createAppWindow()
      .then((appWindow) => {
        appWindow.on('closed', () => {
          // Dereference the window object, usually you would store windows
          // in an array if your app supports multi windows, this is the time
          // when you should delete the corresponding element.
          this.appWindow = null;
        });

        this.appWindow = appWindow;
        this.isCreatingWindow = false;

        return appWindow;
      });
  }

  clearStorageData() {
    this.getWindow()
      .then((window) => {
        window.webContents.session.clearStorageData(() => {
          window.webContents.reload();
        });
      });
  }

  initializeListeners() {
    ipcMain.on('READY', (event) => {
      this.openFileFromArgs();

      if (this.openFileWhenReady) {
        event.sender.send('OPEN_FILE', this.openFileWhenReady);
        this.openFileWhenReady = null;
      }
    });

    ipcMain.on('QUIT', () => {
      global.quit = true;
      app.quit();
    });
  }

  initializeMenu() {
    const menuHandlers = {
      openFile: () => openDialog().then(file => this.openFile(file)),
      saveCopy: () => saveDialog().then(file => this.saveCopy(file)),
      clearStorageData: () => clearStorageDataDialog().then(() => this.clearStorageData()),
    };

    const appMenu = Menu.buildFromTemplate(mainMenu(menuHandlers));
    Menu.setApplicationMenu(appMenu);
  }
}

module.exports = () => new AppManager();
