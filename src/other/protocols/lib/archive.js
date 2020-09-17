import log from 'electron-log';
// import fs from 'fs-extra';
import archiver from 'archiver';
import extractZip from 'extract-zip';
import { createWriteStream } from 'fs';

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
const extract = async (sourcePath, destinationPath) =>
  extractZip(sourcePath, { dir: destinationPath });

/**
 * Write a bundled (zip) protocol from sourcePath (working directory) to destinationPath
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return Returns a promise that resolves to (sourcePath, destinationPath)
 */
const archive = (sourcePath, destinationPath) =>
  new Promise((resolve, reject) => {
    log.debug('archive()', sourcePath, destinationPath);
    const output = createWriteStream(destinationPath);
    const zip = archiver('zip', archiveOptions);

    const handleError = (e) => {
      log.error(e);
      reject(e);
    };

    output.on('close', () => {
      log.debug('archive complete');
      resolve(sourcePath, destinationPath);
    });

    output.on('warning', handleError);
    output.on('error', handleError);

    zip.pipe(output);

    zip.on('warning', handleError);
    zip.on('error', handleError);

    zip.directory(sourcePath, false);

    zip.finalize();
  });

export {
  extract,
  archive,
};
