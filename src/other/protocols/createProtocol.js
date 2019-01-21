import { remote } from 'electron';
import fse from 'fs-extra';
import path from 'path';
import { getLocalDirectoryFromArchivePath } from './utils';
// import template from './template/protocol.json';

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
 * @param {string} destinationPath - destination for skeleton protocol.
 */
const createProtocolWorkingPath = destinationPath =>
  new Promise((resolve) => {
    const appPath = remote.app.getAppPath();
    const templatePath = path.join(appPath, 'template');
    fse.copySync(templatePath, destinationPath);
    resolve(destinationPath);
  });

/**
 * Updates protocol at protocolWorkingPath, merges with existing protocol.
 * Expects a valid protocol object as input.
 * @param {string} protocolWorkingPath - location of protocol
 * @param {object} protocol - protocol object, probably a template.
 */
const updateProtocol = (protocolWorkingPath, protocol) => {
  const protocolPath = path.join(protocolWorkingPath, 'protocol.json');

  return fse.readJson(protocolPath)
    .then((protocolTemplate) => {
      const updatedProtocol = {
        ...protocolTemplate,
        ...protocol,
      };

      return fse.writeJson(protocolPath, updatedProtocol);
    });
};

/**
 * Creates a blank protocol in a tempory path
 * Expects a valid protocol object as input.
 * @param {string} destinationPath - destination for protocol bundle.
 * @param {object} protocol - protocol object, probably a template.
 */
export const createProtocolFiles = (destinationPath, protocol) => {
  const tempPath = getLocalDirectoryFromArchivePath(destinationPath);

  return createProtocolWorkingPath(tempPath)
    .then(protocolWorkingPath => updateProtocol(protocolWorkingPath, protocol))
    .then(() => tempPath);
};

/**
 * Shows a save dialog and then creates a blank protocol there
 */
const createProtocol = () =>
  saveDialog()
    .then((filePath) => {
      const protocol = {
        name: path.basename(filePath, '.netcanvas'),
      };

      return createProtocolFiles(filePath, protocol)
        .then(tempPath => ({ filePath, workingPath: tempPath }));
    });

export default createProtocol;
