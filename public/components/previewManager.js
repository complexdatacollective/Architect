const { ipcMain } = require('electron');
const log = require('./log');

const previewWindowManager = require('./previewWindowManager');

const previewManager = {
  init: function init() {
    log.info('Initialise preview manager');
    previewWindowManager.getWindow();

    ipcMain.on('OPEN_PREVIEW', (event, previewOptions) => {
      previewWindowManager.openPreview(previewOptions);
    });
  },
};

module.exports = previewManager;
