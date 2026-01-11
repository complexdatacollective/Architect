import { electronAPI } from '@utils/electronBridge';
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
const unbundleProtocol = async (filePath) => {
  const destinationPath = await getLocalDirectoryFromArchivePath(filePath);
  const extname = await electronAPI.path.extname(filePath);

  // Check file is readable
  await electronAPI.fs.access(filePath);

  if (extname === '.netcanvas') {
    await extract(filePath, destinationPath);
  } else {
    await electronAPI.fs.copy(filePath, destinationPath);
  }

  return destinationPath;
};

export default unbundleProtocol;
