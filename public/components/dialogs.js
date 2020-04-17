const { dialog } = require('electron');
const log = require('./log');

global.dialogOpen = false;

const openDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

const saveDialogOptions = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
};

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

const openDialog = () => withOpenLock((resolve, reject) => {
  dialog.showOpenDialog(openDialogOptions, (filename) => {
    if (filename === undefined) { reject('DIALOG Cancelled'); return; }
    resolve(filename[0]);
  });
});

const saveDialog = (options = {}) =>
  withOpenLock((resolve, reject) => {
    dialog.showSaveDialog(
      {
        ...saveDialogOptions,
        ...options,
      },
      (filename) => {
        if (filename === undefined) { reject('DIALOG Cancelled'); return; }
        resolve(filename);
      },
    );
  });

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
  openDialog,
  saveDialog,
  clearStorageDataDialog,
};
