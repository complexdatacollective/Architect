import log from 'electron-log';
import fs from 'fs-extra';
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
const extract = (sourcePath, destinationPath) =>
  decompress(
    sourcePath,
    destinationPath,
  ).then(() => destinationPath);

/**
 * Write a bundled (zip) protocol from sourcePath (working directory) to destinationPath
 * @param {string} sourcePath
 * @param {string} destinationPath
 * @return Returns a promise that resolves to (sourcePath, destinationPath)
 */
const archive = (sourcePath, destinationPath) =>
  new Promise((resolve, reject) => {
    log.info('archive()', sourcePath, destinationPath);
    const output = fs.createWriteStream(destinationPath);
    const zip = archiver('zip', archiveOptions);

    output.on('close', () => {
      resolve(sourcePath, destinationPath);
    });

    output.on('warning', reject);
    output.on('error', reject);

    zip.pipe(output);

    zip.on('warning', reject);
    zip.on('error', reject);

    zip.directory(sourcePath, false);

    zip.finalize();
  });

export {
  extract,
  archive,
};
