import { remote } from 'electron';
import fse from 'fs-extra';
import path from 'path';
import { APP_SCHEMA_VERSION } from '@app/config';
import { saveDialog } from '@app/utils/dialogs';
import getLocalDirectoryFromArchivePath from './lib/getLocalDirectoryFromArchivePath';

const saveDialogOptions = {
  buttonLabel: 'Create',
  nameFieldLabel: 'Create as:',
  defaultPath: 'Protocol.netcanvas',
  filters: [{ name: 'Protocols', extensions: ['netcanvas'] }],
};

/**
 * Creates an blank protocol directory at destinationPath, with correct directory structure.
 * @param {string} destinationPath - destination for skeleton protocol.
 */
const createProtocolWorkingPath = (destinationPath) => new Promise((resolve) => {
  const appPath = remote.app.getAppPath();
  const templatePath = path.join(appPath, 'template');
  fse.copySync(templatePath, destinationPath);

  const protocolTemplate = fse.readJsonSync(
    path.join(templatePath, 'protocol.json'),
  );

  const protocol = {
    schemaVersion: APP_SCHEMA_VERSION,
    ...protocolTemplate,
  };

  fse.writeJsonSync(
    path.join(destinationPath, 'protocol.json'),
    protocol,
  );

  // TODO: update protocol with version number

  resolve(destinationPath);
});

/**
 * Creates a blank protocol in a tempory path
 * @param {string} destinationPath - destination for protocol bundle.
 */
export const createProtocolFiles = (destinationPath) => {
  const tempPath = getLocalDirectoryFromArchivePath(destinationPath);

  return createProtocolWorkingPath(tempPath);
};

/**
 * Shows a save dialog and then creates a blank protocol there
 */
const createProtocol = () => saveDialog(saveDialogOptions)
  .then(({ canceled, filePath }) => {
    if (canceled) { return null; }
    return createProtocolFiles(filePath)
      .then((tempPath) => ({ filePath, workingPath: tempPath }));
  });

export default createProtocol;
