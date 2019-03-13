import path from 'path';
import uuid from 'uuid/v1';
import { writeFile } from 'fs-extra';
import readFileAsBuffer from './lib/readFileAsBuffer';

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {buffer} file - The file buffer to copy.
 */
const importAsset = (protocolPath, file) => {
  const destinationName = `${uuid()}${path.extname(file.name)}`;
  const destinationPath = path.join(protocolPath, 'assets', destinationName);

  return readFileAsBuffer(file)
    .then(data => writeFile(destinationPath, data))
    .then(() => destinationName);
};

export default importAsset;
