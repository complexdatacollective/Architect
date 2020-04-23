const { dialog } = require('electron');
const log = require('./log');

global.dialogOpen = false;

const withOpenLock = callback =>
  new Promise((resolve, reject) => {
    if (global.dialogOpen) { reject('DIALOG Already open'); return; }
    resolve();
  })
    .then(() =>
      new Promise((resolve, reject) => {
        global.dialogOpen = true;

        callback(resolve, reject);
      })
        .finally(() => { global.dialogOpen = false; }),
    )
    .catch((message) => { log.info(message); });

// TODO, should this be moved to renderer?
const clearStorageDataDialog = () =>
  withOpenLock((resolve, reject) => {
    dialog.showMessageBox({
      message: 'This will reset all app data, are you sure?',
      buttons: ['OK', 'Cancel'],
    }, (response) => {
      if (response !== 0) { reject('DIALOG Cancelled'); return; }
      resolve();
    });
  });

module.exports = {
  clearStorageDataDialog,
};
