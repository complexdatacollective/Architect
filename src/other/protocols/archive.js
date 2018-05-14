/* eslint-disable */

import { remote } from 'electron';
import uuid from 'uuid';
import path from 'path';
import fs from 'fs';
import decompress from 'decompress';
import archiver from 'archiver';

const archiveOptions = {
  // zlib: { level: 9 },
  store: true,
};

export const getProtocolNameFromArchivePath = fileName => path.basename(fileName, '.netcanvas');
export const getLocalDirectoryFromProtocolName = protocolName => path.join(remote.app.getPath('temp'), uuid(), protocolName);

// returns promise
const extract = (fileName) => {
  const workingPath = getLocalDirectoryFromProtocolName(getProtocolNameFromArchivePath(fileName));

  return decompress(
    fileName,
    workingPath,
  ).then(() => workingPath);
};

const archive = (workingPath, archivePath) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(`${archivePath}.zip`); // TODO: remove .zip
    const zip = archiver('zip', archiveOptions);

    output.on('close', () => {
      resolve(workingPath, archivePath);
    });

    output.on('warning', reject);
    output.on('error', reject);

    zip.pipe(output);

    zip.on('warning', reject);
    zip.on('error', reject);

    zip.directory(workingPath, false);

    zip.finalize();
  });

export {
  extract,
  archive,
};
