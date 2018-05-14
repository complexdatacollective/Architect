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

const extract = (fileName) => {
  const uid = uuid();
  const workingPath = path.join(remote.app.getPath('temp'), uid);

  return decompress(
    fileName,
    workingPath,
  ).then(() => workingPath);
};

const archive = (workingPath, archivePath) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(archivePath);
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
