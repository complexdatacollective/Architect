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

/**
 * Creates an blank protocol directory at destinationPath, with correct directory structure.
 * Expects a valid protocol object as input.
 * @param {string} destinationPath - destination for skeleton protocol.
 * @param {object} protocol - protocol object, probably a template.
 */
const createProtocolWorkingPath = (destinationPath, protocol) =>
  new Promise((resolve) => {
    const assetsPath = path.join(destinationPath, 'assets');
    const protocolPath = path.join(destinationPath, 'protocol.json');
    mkdirp.sync(destinationPath);
    fs.mkdirSync(assetsPath);
    fs.writeFileSync(protocolPath, JSON.stringify(protocol, null, 2));
    resolve();
  });

/**
 * Creates a blank bundled protocol at filePath
 * Expects a valid protocol object as input.
 * @param {string} destinationPath - destination for protocol bundle.
 * @param {object} protocol - protocol object, probably a template.
 */
export const createProtocolArchive = (destinationPath, protocol) => {
  const tempPath = getLocalDirectoryFromArchivePath(destinationPath);

  return createProtocolWorkingPath(tempPath, protocol)
    .then(() => archive(tempPath, destinationPath));
};

/**
 * Shows a save dialog and then creates a blank protocol there
 */
const createProtocol = () =>
  saveDialog()
    .then((filePath) => {
      const protocol = {
        ...template,
        name: path.basename(filePath, '.netcanvas'),
      };

      return createProtocolArchive(filePath, protocol)
        .then(() => filePath);
    });

export default createProtocol;
