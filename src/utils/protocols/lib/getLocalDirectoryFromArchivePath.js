/* eslint-disable import/prefer-default-export */
import uuid from 'uuid';
import { electronAPI } from '@utils/electronBridge';

/**
 * Generates a path in the application /tmp/ to be used
 * as a working copy for editing protocols.
 *
 * @returns The destination path in /tmp/.
 */
const getLocalDirectoryFromArchivePath = async () => {
  const tempPath = await electronAPI.app.getPath('temp');
  return electronAPI.path.join(tempPath, 'protocols', uuid());
};

export default getLocalDirectoryFromArchivePath;
