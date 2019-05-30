const log = require('./components/log');
const { app } = require('electron');
const AppManager = require('./components/appManager');

global.NETWORK_CANVAS_PREVIEW = true;

log.info('App starting...');

let appManager = AppManager();

const shouldQuit = app.makeSingleInstance((argv) => {
  if (!appManager) { return; }

  appManager.openFileFromArgs(argv);
});

if (shouldQuit) {
  app.quit();
}

app.on('open-file', (event, filePath) => {
  if (!appManager) { return; }
  appManager.openFile(filePath);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  appManager.start();
});

app.on('activate', () => {
  if (!appManager) { return; }
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (process.platform === 'darwin') {
    this.openWindow()
      .catch(e => log.info(e));
  }
});

// app.on('window-all-closed', () => {
//   appManager.destroy();
//   appManager = null;
//   app.quit();
// });
