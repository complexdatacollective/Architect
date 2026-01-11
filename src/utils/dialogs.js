import { electronAPI } from '@utils/electronBridge';

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

const createDialogOptions = {
  buttonLabel: 'Create',
  nameFieldLabel: 'Create as:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Protocols', extensions: ['netcanvas'] }],
};

/**
 * Shows a open dialog and resolves to (cancelled, filepath), which mirrors later
 * versions of electron.
 */
const openDialog = (openDialogOptions = {}) => {
  const options = {
    ...defaultOpenDialogOptions,
    ...openDialogOptions,
  };

  return electronAPI.dialog.showOpenDialog(options);
};

/**
 * Shows a save dialog and resolves to (canceled, filepath), which mirrors later
 * versions of electron.
 */
const saveDialog = (saveDialogOptions = {}) => {
  const options = {
    ...defaultSaveDialogOptions,
    ...saveDialogOptions,
  };

  return electronAPI.dialog.showSaveDialog(options);
};

const saveCopyDialog = (saveCopyOptions = {}) => {
  const options = { ...defaultSaveCopyDialogOptions, ...saveCopyOptions };
  return saveDialog(options);
};

export {
  saveDialog,
  saveCopyDialog,
  openDialog,
  createDialogOptions,
};
