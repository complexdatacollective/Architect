import { remote } from 'electron';

const openDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'protocol.canvas',
  filters: [{ name: 'Network Canvas', extensions: ['json'] }],
  properties: ['openFile'],
};

/**
 * Shows a open dialog and returns a filename
 * Can only select *.json files, but returns the path *without* 'protocol.json'
 */
const openDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showOpenDialog(openDialogOptions, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename[0].replace(/\/protocol.json$/, '/'));
    });
  });

const locateProtocol = () =>
  openDialog();

export default locateProtocol;
