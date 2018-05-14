import { remote } from 'electron';
import fs from 'fs';
import path from 'path';
import getLocalDirectory from './getLocalDirectory';
import { archive } from './archive';

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
const createProtocol = (protocolName) => {
  const workingPath = getLocalDirectory(protocolName);

  return saveDialog()
    .then((archivePath) => {
      const assetsPath = path.join(workingPath, 'assets');
      const protocolPath = path.join(workingPath, 'protocol.json');
      fs.mkdirSync(workingPath);
      fs.mkdirSync(assetsPath);
      fs.writeFileSync(protocolPath, '{}');

      return archive(workingPath, archivePath)
        .then(() => ({
          workingPath,
          archivePath,
        }));
    });
};

export default createProtocol;
