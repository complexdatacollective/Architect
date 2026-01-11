import { electronAPI } from '@utils/electronBridge';
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
const createProtocolWorkingPath = async (destinationPath) => {
  const appPath = await electronAPI.app.getAppPath();
  const templatePath = await electronAPI.path.join(appPath, 'template');

  await electronAPI.fs.copy(templatePath, destinationPath);

  const templateProtocolPath = await electronAPI.path.join(templatePath, 'protocol.json');
  const protocolTemplate = await electronAPI.fs.readJson(templateProtocolPath);

  const protocol = {
    schemaVersion: APP_SCHEMA_VERSION,
    ...protocolTemplate,
  };

  const destProtocolPath = await electronAPI.path.join(destinationPath, 'protocol.json');
  await electronAPI.fs.writeJson(destProtocolPath, protocol, { spaces: 2 });

  return destinationPath;
};

/**
 * Creates a blank protocol in a tempory path
 * @param {string} destinationPath - destination for protocol bundle.
 */
export const createProtocolFiles = async (destinationPath) => {
  const tempPath = await getLocalDirectoryFromArchivePath(destinationPath);
  return createProtocolWorkingPath(tempPath);
};

/**
 * Shows a save dialog and then creates a blank protocol there
 */
const createProtocol = async () => {
  const { canceled, filePath } = await saveDialog(saveDialogOptions);

  if (canceled) {
    return null;
  }

  const tempPath = await createProtocolFiles(filePath);
  return { filePath, workingPath: tempPath };
};

export default createProtocol;
