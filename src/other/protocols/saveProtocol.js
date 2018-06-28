import path from 'path';
import { archive } from './archive';
import { writeFile } from '../filesystem';
import pruneProtocolAssets from './pruneProtocolAssets';

/**
 * Given a protocol object save that over the protocol at protocolPath
 * @param {object} protocolMeta - meta data about for protocol RE file system
 * @param {object} protocol - The protocol itself.
 */
const saveProtocol = ({ workingPath, archivePath, advanced }, protocol) => {
  // save json to temp dir
  const destinationPath = path.join(workingPath, 'protocol.json');

  return writeFile(destinationPath, JSON.stringify(protocol, null, 2))
    .then(() => {
      // Now that the protocol is commited to disk we can safely prune unused assets.
      pruneProtocolAssets(workingPath);
    })
    .then(() => {
      if (!advanced) {
        // also save zip
        archive(workingPath, archivePath);
      }
    });
};

export default saveProtocol;
