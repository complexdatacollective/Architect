import path from 'path';
import fs from 'fs-extra';
import { extract } from './lib/archive';
import getLocalDirectoryFromArchivePath from './lib/getLocalDirectoryFromArchivePath';

/**
 * Create a working copy of a protocol in the application
 * tmp directory. If bundled, extract it, if not, copy it.
 *
 * @param filePath - Protocol source path
 *
 * @returns A promise which resolves to the destination path.
 */
const unbundleProtocol = (filePath) => {
  const destinationPath = getLocalDirectoryFromArchivePath(filePath);

  return fs.access(filePath, fs.constants.R_OK)
    .then(() => {
      if (path.extname(filePath) === '.netcanvas') {
        return extract(filePath, destinationPath);
      }

      return fs.copy(filePath, destinationPath);
    })
    .then(() => destinationPath);
};

export default unbundleProtocol;
