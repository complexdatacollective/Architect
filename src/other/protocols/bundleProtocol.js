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
  log.info('bundleProtocol()', workingPath, filePath);
  if (path.extname(filePath) === '.netcanvas') {
    // also save zip
    return archive(workingPath, filePath);
  }
  return fs.copy(workingPath, filePath);
};

export default bundleProtocol;
