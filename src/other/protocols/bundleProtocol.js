import path from 'path';
import fs from 'fs-extra';
import { archive } from './lib/archive';

/**
 * Write protocol from the working directory to the user file system
 *
 * @param {string} workingPath - meta data about for protocol RE file system
 * @param {string} filePath - The protocol path.
 */
const bundleProtocol = (workingPath, filePath) =>
  new Promise((resolve) => {
    if (path.extname(filePath) === '.netcanvas') {
      // also save zip
      resolve(archive(workingPath, filePath));
    } else {
      fs.copySync(workingPath, filePath);
      resolve();
    }
  });

export default bundleProtocol;
