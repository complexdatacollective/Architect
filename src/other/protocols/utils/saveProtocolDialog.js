import { remote } from 'electron';

const saveDialogOptions = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save:',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['saveFile'],
};

const saveCopyDialogOptions = {
  buttonLabel: 'Save Copy',
  nameFieldLabel: 'Save:',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['saveFile'],
};

/**
 * Shows a save dialog and resolves to (cancelled, filepath), which mirrors later
 * versions of electron.
 */
const saveProtocolDialog = (defaultPath = 'Protocol.netcanvas', saveCopy = false) =>
  new Promise((resolve) => {
    const options = saveCopy ? saveCopyDialogOptions : saveDialogOptions;
    remote.dialog.showSaveDialog({ ...options, defaultPath }, (filePath) => {
      const cancelled = filePath === undefined;
      resolve({ cancelled, filePath });
    });
  });

export default saveProtocolDialog;
