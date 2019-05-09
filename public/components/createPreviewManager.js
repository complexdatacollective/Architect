const { ipcMain } = require('electron');
const log = require('./log');
const createPreviewWindow = require('./createPreviewWindow');

const createPreviewManager = () => {
  log.info('Initialize preview manager');

  return createPreviewWindow()
    .then((window) => {
      ipcMain.on('preview:preview', (event, protocol, stageId) => {
        // window.loadIndex();
        window.send('remote:preview', protocol, stageId);
        window.show();
      });

      ipcMain.on('preview:close', () => {
        window.hide();
      });

      ipcMain.on('preview:reset', () => {
        window.loadIndex();
        window.send('remote:reset');
      });

      setImmediate(() => {
        window.send('remote:reset');
      });

      return window;
    });
};

module.exports = createPreviewManager;
