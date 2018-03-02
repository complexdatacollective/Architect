import path from 'path';
import uuid from 'uuid/v1';
import { writeFile } from '../filesystem';
import { readFileAsBuffer } from '../filesystem/web';

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {buffer} file - The file buffer to copy.
 */
const importAssetToProtocol = (protocolPath, file) => {
  const destinationName = `${uuid()}.${path.extname(file.name)}`;
  const destinationPath = path.join(protocolPath, 'assets', destinationName);

  return readFileAsBuffer(file)
    .then(data => writeFile(destinationPath, data))
    .then(() => destinationName);
};

export default importAssetToProtocol;
