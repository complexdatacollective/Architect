const { dialog } = require('electron');

const clearStorageDataDialog = () =>
  dialog.showMessageBox({
    message: 'This will reset all app data, are you sure?',
    buttons: ['OK', 'Cancel'],
  })
    .then(({ response }) => {
      if (response !== 0) { return false; }
      return true;
    });

module.exports = {
  clearStorageDataDialog,
};
