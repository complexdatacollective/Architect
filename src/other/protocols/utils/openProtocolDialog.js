import { remote } from 'electron';

const openDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

/**
 * Shows a open dialog and resolves to (cancelled, filepath), which mirrors later
 * versions of electron.
 * Can only select *.json files, but returns the path *without* 'protocol.json'
 */
const openProtocolDialog = () =>
  new Promise((resolve) => {
    remote.dialog.showOpenDialog(openDialogOptions, (filename) => {
      const cancelled = filename === undefined;
      const filePath = filename && filename[0];
      resolve({ cancelled, filePath });
    });
  });

export default openProtocolDialog;
