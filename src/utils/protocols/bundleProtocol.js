import log from '@utils/logger';
import { electronAPI } from '@utils/electronBridge';
import { archive } from './lib/archive';

/**
 * Write protocol from the working directory to the user file system
 *
 * @param {string} workingPath - meta data about for protocol RE file system
 * @param {string} filePath - The protocol path.
 */
const bundleProtocol = async (workingPath, filePath) => {
  const extname = await electronAPI.path.extname(filePath);

  if (extname === '.netcanvas') {
    log.debug(`Save protocol ${filePath} as archive`);
    return archive(workingPath, filePath);
  }

  log.debug(`Save protocol ${filePath} as directory`);
  return electronAPI.fs.copy(workingPath, filePath);
};

export default bundleProtocol;
