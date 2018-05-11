import { remote } from 'electron';
import path from 'path';
import fs from 'fs';
import decompress from 'decompress';
import archiver from 'archiver';

const archiveOptions = {
  zlib: { level: 9 },
};

const getProtocolName = fileName => /.*\/([^/\\]+)\.netcanvas$/.exec(fileName)[1];
const getLocalDirectory = protocolName => path.join(remote.getPath('temp'), protocolName);

// returns promise
const extract = fileName =>
  decompress(
    fileName,
    getLocalDirectory(getProtocolName(fileName)),
  );

const archive = (protocolName, fileName) =>
  new Promise((resolve, reject) => {
    const output = fs.createWriteStream(fileName);
    const zip = archiver('zip', archiveOptions);
    const source = getLocalDirectory(protocolName);

    output.on('end', () => { resolve(fileName); });

    zip.on('warning', reject);
    zip.on('error', reject);

    zip.directory(source, false);

    zip.finalize();
  });

export {
  extract,
  archive,
};
