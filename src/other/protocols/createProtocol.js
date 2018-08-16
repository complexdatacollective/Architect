import { remote } from 'electron';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import { archive } from './archive';
import { getLocalDirectoryFromArchivePath } from './utils';
import template from './template.json';

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

const createProtocolWorkingPath = (workingPath, protocol) =>
  new Promise((resolve) => {
    const assetsPath = path.join(workingPath, 'assets');
    const protocolPath = path.join(workingPath, 'protocol.json');
    mkdirp.sync(workingPath);
    fs.mkdirSync(assetsPath);
    fs.writeFileSync(protocolPath, JSON.stringify(protocol, null, 2));
    resolve();
  });

export const createProtocolArchive = ({ workingPath, archivePath }, protocol) =>
  createProtocolWorkingPath(workingPath, protocol)
    .then(() => archive(workingPath, archivePath));

/**
 * Shows a save dialog and then creates an empty protocol there
 */
const createProtocol = () =>
  saveDialog()
    .then((filePath) => {
      const workingPath = getLocalDirectoryFromArchivePath(filePath);

      return createProtocolArchive({
        workingPath,
        filePath,
      }, {
        ...template,
        name: path.basename(filePath, '.netcanvas'),
      })
        .then(() => ({
          workingPath,
          filePath,
        }));
    });

export default createProtocol;
