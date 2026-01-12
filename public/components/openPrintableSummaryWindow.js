const { BrowserWindow } = require('electron');
const path = require('path');
const log = require('./log');

function getPreloadPath() {
  // __dirname is dist/main/components/, preload is at dist/preload/
  return path.join(__dirname, '../../preload/summary.js');
}

function openPrintableSummaryWindow(payload) {
  return new Promise((resolve) => {
    // Create the browser window.
    global.summaryWindow = new BrowserWindow({
      parent: global.appWindow,
      modal: true,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: getPreloadPath(),
      },
      height: 900,
      width: 1024,
      menuBarVisible: false,
    });

    // Prevent new windows from being opened (e.g., shift|cmd-click)
    global.summaryWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    // For now, any navigation off the SPA is unneeded
    global.summaryWindow.webContents.on('will-navigate', (evt) => {
      evt.preventDefault();
    });

    global.summaryWindow.on('close', () => {
      delete global.summaryWindow;
    });

    global.summaryWindow.webContents.on('did-finish-load', () => {
      global.summaryWindow.webContents.send('SUMMARY_DATA', payload);
      global.summaryWindow.show();
      resolve(global.summaryWindow);
    });

    // Load the app URL based on environment
    if (process.env.ELECTRON_RENDERER_URL) {
      log.info('Loading summary from dev server:', `${process.env.ELECTRON_RENDERER_URL}#summary`);
      global.summaryWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}#summary`);
    } else {
      // Production: __dirname is dist/main/components, renderer is at dist/renderer
      const indexPath = path.join(__dirname, '../../renderer/index.html');
      log.info('Loading summary from file:', indexPath);
      global.summaryWindow.loadFile(indexPath, { hash: 'summary' });
    }
  });
}

module.exports = openPrintableSummaryWindow;
