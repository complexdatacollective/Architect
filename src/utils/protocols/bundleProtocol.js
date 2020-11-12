import log from 'electron-log';
import path from 'path';
import fse from 'fs-extra';
import { archive } from './lib/archive';

/**
 * Write protocol from the working directory to the user file system
 *
 * @param {string} workingPath - meta data about for protocol RE file system
 * @param {string} filePath - The protocol path.
 */
const bundleProtocol = (workingPath, filePath) => {
  if (path.extname(filePath) === '.netcanvas') {
    log.debug(`Save protocol ${filePath} as archive`);
    return archive(workingPath, filePath);
  }

  log.debug(`Save protocol ${filePath} as directory`);
  return fse.copy(workingPath, filePath);
};

export default bundleProtocol;
