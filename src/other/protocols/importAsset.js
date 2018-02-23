import path from 'path';
import { readFile, writeFile } from '../filesystem';

const importAsset = (protocolPath, file) => {
  const destinationPath = path.join(protocolPath, file.name);

  return readFile(file)
    .then(data => writeFile(destinationPath, data))
    .then(() => file.name);
};

export default importAsset;
