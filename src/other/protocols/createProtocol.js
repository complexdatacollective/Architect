import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

const saveDialogOptions = {
  buttonLabel: 'Create',
  nameFieldLabel: 'Create as:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Protocols', extensions: ['netcanvas'] }],
};

/**
 * Shows a save dialog (wrapped in a promise)
 */
const saveDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog(saveDialogOptions, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename);
    });
  });

/**
 * Shows a save dialog and then creates an empty protocol there
 */
const createProtocol = () =>
  saveDialog().then((filename) => {
    const assetsPath = path.join(filename, 'assets');
    const protocolPath = path.join(filename, 'protocol.json');
    fs.mkdirSync(filename);
    fs.mkdirSync(assetsPath);
    fs.writeFileSync(protocolPath, '{}');
    return filename;
  });

export default createProtocol;
