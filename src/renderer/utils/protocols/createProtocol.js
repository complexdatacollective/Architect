import { fileSystem, path, app } from '~/app/api';
import { APP_SCHEMA_VERSION } from '~/app/config';
import { saveDialog } from '~/app/utils/dialogs';
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
const createProtocolWorkingPath = async (destinationPath) => {
  const appPath = await app.getAppPath();
  const templatePath = await path.join(appPath, 'template');
  await fileSystem.copy(templatePath, destinationPath);

  const protocolTemplate = await fileSystem.readJson(
    await path.join(templatePath, 'protocol.json'),
  );

  const protocol = {
    schemaVersion: APP_SCHEMA_VERSION,
    ...protocolTemplate,
  };

  await fileSystem.writeJson(
    await path.join(destinationPath, 'protocol.json'),
    protocol,
  );

  // TODO: update protocol with version number

  return destinationPath;
};

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
