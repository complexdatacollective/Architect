/* eslint-disable class-methods-use-this */

const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');
const log = require('./log');

global.silentUpdates = false;

const releasesUrl = 'https://github.com/complexdatacollective/Architect/releases';

const updateListeners = {
};

const onUpdateAvailable = (updateInfo) => {
  updateListeners.cleanup();

  dialog.showMessageBox({
    type: 'question',
    title: 'Update Available',
    message: 'Do you want update now?',
    detail: `Version ${updateInfo.releaseName} is available.\n\nRelease notes are available at:\n${releasesUrl}\n\nClick 'Download and Restart' to fetch this update and install it. Ensure you have exported or backed up any important data before continuing.`,
    buttons: ['Download and Restart', 'Cancel'],
  },
  (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate();
    }
  });
};

const onUpdateNotAvailable = () => {
  updateListeners.cleanup();

  dialog.showMessageBox({
    title: 'No Updates Available',
    message: 'Network Canvas is up-to-date.',
  });
};

const onUpdateDownloaded = () => {
  dialog.showMessageBox({
    title: 'Install Update',
    message: 'Download Complete',
    detail: 'Your update is ready to install. You must now restart the app and install the update.',
    buttons: ['Restart'],
  },
  () => setImmediate(() => autoUpdater.quitAndInstall()));
};

const onError = (error) => {
  const detail = error ? (error.stack || error).toString() : 'An unknown error occurred';

  log.error(detail);

  if (global.silentUpdates) {
    log.info('Update Error (Did not notify user)');
    return;
  }

  dialog.showMessageBox({
    title: 'Error',
    message: 'Download Complete',
    detail: 'There was an error checking for updates. You may need to update this app manually.',
    buttons: ['Okay'],
  });
};

updateListeners.setup = (notAvailable = true, available = true) => {
  if (available) { autoUpdater.on('update-available', onUpdateAvailable); }
  if (notAvailable) { autoUpdater.on('update-not-available', onUpdateNotAvailable); }
};

updateListeners.cleanup = () => {
  autoUpdater.off('update-available', onUpdateAvailable);
  autoUpdater.off('update-not-available', onUpdateNotAvailable);
};

const checkForUpdates = (notAvailable = true, available = true) => {
  updateListeners.setup(notAvailable, available);
  autoUpdater.checkForUpdates();
};

autoUpdater.autoDownload = false;
autoUpdater.on('update-downloaded', onUpdateDownloaded);
autoUpdater.on('error', onError);

global.updater = {
  checkForUpdates,
};

const getUpdater = () => {
  return global.updater;
};

module.exports = getUpdater;

