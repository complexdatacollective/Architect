import path from 'path';
import fs from 'fs-extra';
import { archive } from './archive';

/**
 * Write protocol from the working directory to the protocol path
 *
 * @param {string} workingPath - meta data about for protocol RE file system
 * @param {string} filePath - The protocol path.
 */
const exportProtocol = (workingPath, filePath) =>
  new Promise((resolve) => {
    if (path.extname(filePath) === '.netcanvas') {
      // also save zip
      resolve(archive(workingPath, filePath));
    } else {
      fs.copySync(workingPath, filePath);
      resolve();
    }
  });

export default exportProtocol;
