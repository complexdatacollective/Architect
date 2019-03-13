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
const unbundleProtocol = filePath =>
  new Promise((resolve) => {
    const destinationPath = getLocalDirectoryFromArchivePath(filePath);

    if (path.extname(filePath) === '.netcanvas') {
      extract(filePath, destinationPath)
        .then(resolve);
    } else {
      fs.copySync(filePath, destinationPath);
      resolve(destinationPath);
    }
  });

export default unbundleProtocol;
