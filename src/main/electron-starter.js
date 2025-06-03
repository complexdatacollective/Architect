const { app, protocol } = require('electron');
const log = require('./components/log');
const createAppWindow = require('./components/createAppWindow');
const AppManager = require('./components/appManager');
const loadDevTools = require('./components/loadDevTools');
const registerAssetProtocol = require('./components/assetProtocol').registerProtocol;

protocol.registerSchemesAsPrivileged([{
  scheme: 'asset',
  privileges: {
    secure: true,
    supportFetchAPI: true,
    bypassCSP: true,
    corsEnabled: true,
  },
}]);

log.info('App starting...');

const appManager = new AppManager();

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  log.info('Another instance of Architect is already running...quitting.');
  app.quit();
  return;
}

app.on('second-instance', (_, commandLine) => {
  log.info('openFileFromArgs', commandLine);
  AppManager.openFileFromArgs(commandLine);
});

// open file on os x
app.on('open-file', (event, filePath) => {
  log.info('openFile', filePath);
  AppManager.openFile(filePath);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  registerAssetProtocol();

  Promise.all([
    createAppWindow(),
    loadDevTools(),
  ])
    .then(() => {
      log.info('Windows initialized');
      appManager.start();
    })
    .catch((e) => {
      log.error(e);
    });
});

app.on('window-all-closed', () => {
  AppManager.quit();
  global.appWindow = null;
  global.summaryWindow = null;
  app.quit();
});
