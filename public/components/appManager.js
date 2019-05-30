const { ipcMain, app, Menu, BrowserWindow } = require('electron');
const log = require('./log');
const path = require('path');
const { openDialog, saveDialog, clearStorageDataDialog } = require('./dialogs');
const mainMenu = require('./mainMenu');
const registerAssetProtocol = require('./assetProtocol').registerProtocol;

function getFileFromArgs(argv) {
  if (!argv) { return null; }
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
  static openWindow() {
    if (!global.appWindow) { return; }
    global.appWindow.open();
  }

  static removeListeners() {
    ipcMain.removeAllListeners('READY');
    ipcMain.removeAllListeners('QUIT');
    ipcMain.removeAllListeners('ACTION');
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

  static send(...args) {
    if (!global.appWindow) { return; }
    global.appWindow.webContents.send(...args);
  }

  static openFileFromArgs(argv) {
    if (process.platform === 'win32') {
      const filePath = getFileFromArgs(argv);

      if (filePath) {
        if (!app.isReady()) {
          global.openFileWhenReady = filePath;
          return;
        }

        AppManager.openFile(filePath);
      }
    }
  }

  static openFile(fileToOpen) {
    AppManager.send('OPEN_FILE', fileToOpen);
  }

  static clearStorageData() {
    if (!global.appWindow) { return; }

    global.appWindow.webContents.session.clearStorageData(() => {
      global.appWindow.webContents.reload();
    });
  }

  static saveCopy(filePath) {
    AppManager.send('SAVE_COPY', filePath);
  }

  static save() {
    AppManager.send('SAVE');
  }

  static quit() {
    global.quit = true;

    AppManager.removeListeners();
    app.quit();
  }

  constructor() {
    this.openFileWhenReady = null;
    this.activeProtocol = null;
  }

  start() {
    log.info('Start appManager');

    global.appWindow.on('focus', () => {
      this.updateMenu();
    });

    global.appWindow.on('close', (e) => {
      if (!global.quit) {
        log.info('Confirm close');
        e.preventDefault();
        AppManager.send('CONFIRM_CLOSE');

        return false;
      }

      return true;
    });

    registerAssetProtocol();
    this.initializeListeners();
    this.updateMenu();

    if (global.openFileWhenReady) {
      AppManager.openFile(global.openFileWhenReady);
      global.openFileWhenReady = null;
    }
  }

  initializeListeners() {
    ipcMain.on('READY', () => {
      log.info('Renderer ready');
      AppManager.openFileFromArgs();
    });

    ipcMain.on('QUIT', () => {
      log.info('Renderer quit');
      AppManager.quit();
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

  updateMenu() {
    const menuOptions = {
      isProtocolOpen: !!this.activeProtocol,
      openFile: () => openDialog().then(file => AppManager.openFile(file)),
      saveCopy: () => {
        const defaultPath = this.activeProtocol.filePath;
        saveDialog({ defaultPath })
          .then(filePath => AppManager.saveCopy(filePath));
      },
      save: () => AppManager.save(),
      clearStorageData: () => clearStorageDataDialog().then(() => AppManager.clearStorageData()),
    };

    const appMenu = Menu.buildFromTemplate(mainMenu(menuOptions));
    Menu.setApplicationMenu(appMenu);
  }
}

module.exports = AppManager;
