import log from 'electron-log';
import { path, fileSystem } from '~/app/api';
import { archive } from './lib/archive';

/**
 * Write protocol from the working directory to the user file system
 *
 * @param {string} workingPath - meta data about for protocol RE file system
 * @param {string} filePath - The protocol path.
 */
const bundleProtocol = async (workingPath, filePath) => {
  const ext = await path.extname(filePath);
  
  if (ext === '.netcanvas') {
    log.debug(`Save protocol ${filePath} as archive`);
    return archive(workingPath, filePath);
  }

  log.debug(`Save protocol ${filePath} as directory`);
  return fileSystem.copy(workingPath, filePath);
};

export default bundleProtocol;
