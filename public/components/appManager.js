const { ipcMain, app, Menu } = require('electron');
const log = require('./log');
const path = require('path');
const openPrintableSummaryWindow = require('./openPrintableSummaryWindow');
const { clearStorageDataDialog } = require('./dialogs');
const mainMenu = require('./mainMenu');

function getFileFromArgs(argv) {
  if (!argv) { return null; }
  if (argv.length >= 2) {
    const filePath = argv.find(arg => path.extname(arg) === '.netcanvas');
    if (filePath) {
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

  static send(...args) {
    if (!global.appWindow) { return false; }
    global.appWindow.webContents.send(...args);
    return true;
  }

  // Check process.argv after startup (win)
  static checkAndOpenFileFromArgs() {
    log.info('checkAndOpenFileFromArgs', process.argv);
    if (process.platform === 'win32' || process.platform === 'linux') {
      AppManager.openFileFromArgs(process.argv);
    }
  }

  static openFileFromArgs(argv) {
    log.info('openFileFromArgs', argv);
    if (process.platform === 'win32' || process.platform === 'linux') {
      const filePath = getFileFromArgs(argv);

      if (filePath) {
        AppManager.openFile(filePath);
      }
    }
  }

  static openFile(fileToOpen) {
    if (!app.isReady()) {
      global.openFileWhenReady = fileToOpen;
      return;
    }

    AppManager.send('OPEN_FILE', fileToOpen);
  }

  static clearStorageData() {
    if (!global.appWindow) { return; }

    global.appWindow.webContents.session.clearStorageData()
      .then(() => global.appWindow.webContents.reload());
  }

  static open() {
    AppManager.send('OPEN');
  }

  static saveCopy() {
    AppManager.send('SAVE_COPY');
  }

  static save() {
    AppManager.send('SAVE');
  }

  static printSummary() {
    AppManager.send('PRINT_SUMMARY');
  }

  static quit() {
    global.quit = true;

    AppManager.removeListeners();
    app.quit();
  }

  constructor() {
    this.openFileWhenReady = null;
    this.activeProtocol = null;
    // this.enableSaving = false;
    this.hasChanges = false;
    this.isProtocolValid = false;

    ipcMain.on('READY', () => {
      log.info('receive: READY');
      AppManager.checkAndOpenFileFromArgs(); // windows

      if (global.openFileWhenReady) {
        AppManager.openFile(global.openFileWhenReady);
        global.openFileWhenReady = null;
      }
    });

    ipcMain.on('QUIT', () => {
      log.info('receive: QUIT');
      AppManager.quit();
    });

    ipcMain.on('CONFIRM_CLOSE_ACK', () => {
      log.info('receive: CONFIRM_CLOSE_ACK');
      global.confirmCloseAck = true;
    });

    ipcMain.on('ACTION', (e, action) => {
      log.info('receive: ACTION', action.type);
      switch (action.type) {
        case 'SESSION/OPEN_NETCANVAS_SUCCESS':
          this.activeProtocol = action.payload.filePath;
          this.hasChanges = false;
          this.isProtocolValid = action.payload.protocolIsValid;
          this.updateMenu();
          break;
        case 'SESSION/SAVE_NETCANVAS_SUCCESS':
          this.hasChanges = false;
          this.updateMenu();
          break;
        case 'SESSION/RESET':
          this.activeProtocol = null;
          this.hasChanges = false;
          this.isProtocolValid = false;
          this.updateMenu();
          break;
        case 'SESSION/PROTOCOL_CHANGED':
          this.hasChanges = true;
          this.isProtocolValid = action.protocolIsValid;
          this.updateMenu();
          break;
        case 'PRINT_SUMMARY_DATA':
          openPrintableSummaryWindow(action.payload);
          break;
        default:
          log.info(JSON.stringify(action, null, 2));
      }
    });
  }

  start() {
    log.info('Start appManager');

    global.appWindow.on('focus', () => {
      this.updateMenu();
    });

    global.appWindow.on('close', (e) => {
      if (!global.quit) {
        e.preventDefault();
        global.confirmCloseAck = false;
        log.info('send: CONFIRM_CLOSE');
        AppManager.send('CONFIRM_CLOSE');

        setTimeout(() => {
          if (!global.confirmCloseAck) {
            // If renderer does not acknowledge, e.g. app content is not loaded/crashed.
            AppManager.quit();
          }
        }, 500);

        return false;
      }

      return true;
    });

    this.updateMenu();
  }

  updateMenu() {
    const menuOptions = {
      isProtocolOpen: !!this.activeProtocol,
      // isProtocolValid: !!this.enableSaving,
      isProtocolValid: this.isProtocolValid,
      hasChanges: this.hasChanges,
      open: () => AppManager.open(),
      saveCopy: () => AppManager.saveCopy(),
      save: () => AppManager.save(),
      printSummary: () => AppManager.printSummary(),
      clearStorageData: () =>
        clearStorageDataDialog()
          .then((shouldClearStorage) => {
            if (!shouldClearStorage) { return; }
            AppManager.clearStorageData();
          }),
    };

    const appMenu = Menu.buildFromTemplate(mainMenu(menuOptions));

    if (process.platform === 'win32' || process.platform === 'linux') {
      global.appWindow.setMenu(appMenu);
    } else {
      Menu.setApplicationMenu(appMenu);
    }
  }
}

module.exports = AppManager;
