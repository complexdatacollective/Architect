import path from 'path';
import { writeFile } from '../filesystem';
import pruneProtocolAssets from './pruneProtocolAssets';

/**
 * Save a protocol object to disk, and prune any unused assets from
 * /assets/ sub directory.
 * @param {string} workingPath - working path in application /tmp/ dir
 * @param {object} protocol - The protocol object.
 */
const saveProtocol = (workingPath, protocol) => {
  // save json to temp dir
  const destinationPath = path.join(workingPath, 'protocol.json');

  return writeFile(destinationPath, JSON.stringify(protocol, null, 2))
    .then(() =>
      // Now that the protocol is commited to disk we can safely prune unused assets.
      pruneProtocolAssets(workingPath),
    )
    .then(() => destinationPath);
};

export default saveProtocol;
