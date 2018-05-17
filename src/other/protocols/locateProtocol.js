import { remote } from 'electron';

const openDialogOptions = {
  buttonLabel: 'Open',
  nameFieldLabel: 'Open:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Network Canvas', extensions: ['netcanvas'] }],
  properties: ['openFile'],
};

/**
 * Shows a open dialog and returns a filename
 * Can only select *.json files, but returns the path *without* 'protocol.json'
 */
const openDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showOpenDialog(openDialogOptions, (filename) => {
      if (filename === undefined) { reject(); return; }
      resolve(filename[0]);
    });
  });

const locateProtocol = () =>
  openDialog();

export default locateProtocol;
