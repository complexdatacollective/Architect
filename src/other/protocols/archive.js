import path from 'path';
import fs from 'fs';
import decompress from 'decompress';
import archiver from 'archiver';
import getLocalDirectory from './getLocalDirectory';

const archiveOptions = {
  zlib: { level: 9 },
};

const getProtocolName = fileName => path.basename(fileName, '.netcanvas');

// returns promise
const extract = (fileName) => {
  const workingPath = getLocalDirectory(getProtocolName(fileName));

  return decompress(
    fileName,
    workingPath,
  ).then(() => workingPath);
};

const archive = (workingPath, fileName) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(fileName);
    const zip = archiver('zip', archiveOptions);

    output.on('end', () => { resolve(fileName); });

    zip.on('warning', reject);
    zip.on('error', reject);

    zip.directory(workingPath, false);

    zip.finalize();
  });

export {
  extract,
  archive,
};
