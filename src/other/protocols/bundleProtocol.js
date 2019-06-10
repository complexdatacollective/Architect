import log from 'electron-log';
import path from 'path';
import fs from 'fs-extra';
import { archive } from './lib/archive';

/**
 * Write protocol from the working directory to the user file system
 *
 * @param {string} workingPath - meta data about for protocol RE file system
 * @param {string} filePath - The protocol path.
 */
const bundleProtocol = (workingPath, filePath) => {
  log.debug('bundleProtocol()', workingPath, filePath);
  if (path.extname(filePath) === '.netcanvas') {
    // also save zip
    log.debug('  treat as archive');
    return archive(workingPath, filePath);
  }

  log.debug('  treat as directory');
  return fs.copy(workingPath, filePath);
};

export default bundleProtocol;
