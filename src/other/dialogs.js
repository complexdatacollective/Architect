import { remote } from 'electron';

const defaultOpenDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

const defaultSaveDialogOptions = {
  buttonLabel: 'Save',
  nameFieldLabel: 'Save:',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['saveFile'],
};

const defaultSaveCopyDialogOptions = {
  buttonLabel: 'Save Copy',
  nameFieldLabel: 'Save:',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['saveFile'],
};


/**
 * Shows a open dialog and resolves to (cancelled, filepath), which mirrors later
 * versions of electron.
 */
const openDialog = (openDialogOptions = {}) =>
  new Promise((resolve) => {
    const options = {
      ...defaultOpenDialogOptions,
      ...openDialogOptions,
    };

    remote.dialog.showOpenDialog(
      remote.getCurrentWindow(),
      options,
      (filename) => {
        const cancelled = filename === undefined;
        const filePath = filename && filename[0];
        const filePaths = filename;
        resolve({ cancelled, filePath, filePaths });
      },
    );
  });


/**
 * Shows a save dialog and resolves to (cancelled, filepath), which mirrors later
 * versions of electron.
 */
const saveDialog = (saveDialogOptions = {}) =>
  new Promise((resolve) => {
    const options = {
      ...defaultSaveDialogOptions,
      ...saveDialogOptions,
    };

    remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      options,
      (filePath) => {
        const cancelled = filePath === undefined;
        resolve({ cancelled, filePath });
      },
    );
  });

const saveCopyDialog = (saveCopyOptions = {}) => {
  const options = { ...defaultSaveCopyDialogOptions, ...saveCopyOptions };
  return saveDialog(options);
};

export {
  saveDialog,
  saveCopyDialog,
  openDialog,
};

