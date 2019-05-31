const { app } = require('electron');
const log = require('./components/log');
const createAppWindow = require('./components/createAppWindow');
const createPreviewWindow = require('./components/createPreviewWindow');
const AppManager = require('./components/appManager');
const PreviewManager = require('./components/previewManager');

global.NETWORK_CANVAS_PREVIEW = true;

log.info('App starting...');

const appManager = new AppManager();
const previewManager = new PreviewManager(); // eslint-disable-line

const shouldQuit = app.makeSingleInstance((argv) => {
  appManager.openFileFromArgs(argv);
});

if (shouldQuit) {
  appManager.quit();
}

app.on('open-file', (event, filePath) => {
  AppManager.openFile(filePath);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  Promise.all([
    createAppWindow(),
    createPreviewWindow(),
  ])
    .then(() => {
      log.info('Windows initialized');
      appManager.start();
      previewManager.start();
    })
    .catch((e) => {
      log.error(e);
    });
});

app.on('window-all-closed', () => {
  AppManager.quit();
  PreviewManager.quit();
  global.appWindow = null;
  global.previewWindow = null;
  app.quit();
});
