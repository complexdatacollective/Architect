import { remote } from 'electron';
import fs from 'fs';
import path from 'path';

const saveDialogOptions = {
  buttonLabel: 'Create',
  nameFieldLabel: 'Create as:',
  defaultPath: 'Protocol.canvas',
  filters: [{ name: 'Protocols', extensions: ['canvas'] }],
};

const saveDialog = () =>
  new Promise((resolve, reject) => {
    remote.dialog.showSaveDialog(saveDialogOptions, (filename) => {
      if (filename === undefined) { reject(); }
      resolve(filename);
    });
  });

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
