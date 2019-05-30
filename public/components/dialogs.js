const { dialog } = require('electron');

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

const openDialog = () =>
  new Promise((resolve, reject) => {
    dialog.showOpenDialog(openDialogOptions, (filename) => {
      if (filename === undefined) { reject(); return; }
      resolve(filename[0]);
    });
  });

// TODO: options = { defaultPath } to set preliminary file name
const saveDialog = (options = {}) =>
  new Promise((resolve, reject) => {
    dialog.showSaveDialog(
      {
        ...saveDialogOptions,
        ...options,
      },
      (filename) => {
        if (filename === undefined) { reject(); return; }
        resolve(filename[0]);
      },
    );
  });

const clearStorageDataDialog = () =>
  new Promise((resolve, reject) => {
    dialog.showMessageBox({
      message: 'This will reset all app data, are you sure?',
      buttons: ['OK', 'Cancel'],
    }, (response) => {
      if (response !== 0) { reject(); return; }
      resolve();
    });
  });

module.exports = {
  openDialog,
  saveDialog,
  clearStorageDataDialog,
};
