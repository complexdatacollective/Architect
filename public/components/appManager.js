const { ipcMain, app, Menu, BrowserWindow } = require('electron');
const log = require('./log');
const path = require('path');
const { openDialog, saveDialog, clearStorageDataDialog } = require('./dialogs');
const mainMenu = require('./mainMenu');
// const createPreviewManager = require('./createPreviewManager');
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
    this.activeProtocol = null;
  }

  start() {
    registerAssetProtocol();
    this.initializeListeners();

    this.updateMenu();

    this.openWindow()
      .catch(e => log.info(e));

    // createPreviewManager().then(() => {
    //   log.info('created preview manager');
    // });
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
        })
        .catch(e => log.info(e));
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
    if (!app.isReady()) {
      return Promise.reject(new Error('Could not get window because app is not ready'));
    }

    if (this.isCreatingWindow) {
      return Promise.reject(new Error('Could not get window because app is already creating one'));
    }

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

          // TODO: close preview window too.
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

    ipcMain.on('ACTION', (e, action) => {
      switch (action.type) {
        case 'PROTOCOLS/LOAD_SUCCESS':
          this.activeProtocol = action.meta;
          this.updateMenu();
          break;
        case 'SESSION/RESET':
          this.activeProtocol = null;
          this.updateMenu();
          break;
        default:
          log.info(JSON.stringify(action, null, 2));
      }
    });
  }

  destroy() {
    this.appWindow = null;
    ipcMain.removeAllListeners('READY');
    ipcMain.removeAllListeners('QUIT');
    ipcMain.removeAllListeners('ACTION');
  }

  saveCopy(filePath) {
    this.getWindow()
      .then((window) => {
        window.webContents.send('SAVE_COPY', filePath);
      })
      .catch(e => log.info(e));
  }

  save() {
    this.getWindow()
      .then((window) => {
        window.webContents.send('SAVE');
      })
      .catch(e => log.info(e));
  }

  updateMenu() {
    const menuOptions = {
      isProtocolOpen: !!this.activeProtocol,
      openFile: () => openDialog().then(file => this.openFile(file)),
      saveCopy: () => {
        const defaultPath = this.activeProtocol.filePath;
        saveDialog({ defaultPath })
          .then(filePath => this.saveCopy(filePath));
      },
      save: () => this.save(),
      clearStorageData: () => clearStorageDataDialog().then(() => this.clearStorageData()),
    };

    const appMenu = Menu.buildFromTemplate(mainMenu(menuOptions));
    Menu.setApplicationMenu(appMenu);
  }
}

module.exports = () => new AppManager();
