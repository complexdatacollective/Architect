import path from 'path';
import { archive } from '../../other/archive';
import { writeFile } from '../filesystem';

/**
 * Given a protocol object save that over the protocol at protocolPath
 * @param {string} protocolPath - The destination directory.
 * @param {object} protocol - The protocol itself.
 */
const saveProtocol = ({ workingPath, archivePath, advanced }, protocol) => {
  // save json
  const destinationPath = path.join(workingPath, 'protocol.json');

  writeFile(destinationPath, JSON.stringify(protocol, null, 2))
    .then(() => {
      if (!advanced) {
        // also save zip
        archive(workingPath, archivePath);
      }
    });
};

export default saveProtocol;
