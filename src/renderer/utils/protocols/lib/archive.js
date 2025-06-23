import log from 'electron-log';
import { fileSystem } from '~/app/api';
import decompress from 'decompress';
import archiver from 'archiver';

// Since this will be compressed over the wire, we choose uncompressed for speed
const archiveOptions = {
  // zlib: { level: 9 },
  store: true,
};

/**
 * Extract bundled (zip) protocol from sourcePath to destinationPath
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return Returns a promise that resolves to the destination path
 */
const extract = (sourcePath, destinationPath) => decompress(
  sourcePath,
  destinationPath,
).then(() => destinationPath);

/**
 * Write a bundled (zip) protocol from sourcePath (working directory) to destinationPath
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return Returns a promise that resolves to (sourcePath, destinationPath)
 */
// Note: We'll use the protocol handlers for archive operations
// since streams are complex to handle over IPC
const archive = async (sourcePath, destinationPath) => {
  log.debug('archive()', sourcePath, destinationPath);
  
  // Use the IPC-based export function instead of direct archiver
  const { fileSystemAPI } = window;
  
  try {
    await fileSystemAPI.exportNetcanvas(sourcePath, destinationPath);
    log.debug('archive complete');
    return destinationPath;
  } catch (error) {
    log.error('Archive failed:', error);
    throw error;
  }
};

export {
  extract,
  archive,
};
