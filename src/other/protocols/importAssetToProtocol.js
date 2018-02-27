import path from 'path';
import { readFile, writeFile } from '../filesystem';

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {buffer} file - The file buffer to copy.
 */
const importAssetToProtocol = (protocolPath, file) => {
  const destinationPath = path.join(protocolPath, file.name);

  return readFile(file)
    .then(data => writeFile(destinationPath, data))
    .then(() => file.name);
};

export default importAssetToProtocol;
