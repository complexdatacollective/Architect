const { ipcMain } = require('electron');
const log = require('./log');

const previewWindowManager = require('./previewWindowManager');

const previewManager = {
  init: function init() {
    log.info('Initialise preview manager');
    previewWindowManager.getWindow().then(win => win.show());

    ipcMain.on('OPEN_PREVIEW', (event, previewOptions) => {
      previewWindowManager.openPreview(previewOptions);
    });

    ipcMain.on('CLOSE_PREVIEW', () => {
      previewWindowManager.closePreview();
    });
  },
};

module.exports = previewManager;
