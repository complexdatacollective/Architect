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
      pruneProtocolAssets(workingPath);
    })
    .then(() => {
      if (!advanced) {
        // also save zip
        console.log('zip it', workingPath, archivePath);
        archive(workingPath, archivePath);
      }
    });
};

export default saveProtocol;
