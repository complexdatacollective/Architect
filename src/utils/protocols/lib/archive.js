import { electronAPI } from '@utils/electronBridge';

/**
 * Extract bundled (zip) protocol from sourcePath to destinationPath
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return Returns a promise that resolves to the destination path
 */
const extract = async (sourcePath, destinationPath) => {
  await electronAPI.archive.extract(sourcePath, destinationPath);
  return destinationPath;
};

/**
 * Write a bundled (zip) protocol from sourcePath (working directory) to destinationPath
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return Returns a promise that resolves to (sourcePath, destinationPath)
 */
const archive = async (sourcePath, destinationPath) => {
  await electronAPI.archive.create(sourcePath, destinationPath);
  return [sourcePath, destinationPath];
};

export {
  extract,
  archive,
};
