import path from 'path';
import log from 'electron-log';
import { writeFile } from 'fs-extra';
import pruneAssets from './utils/pruneAssets';

/**
 * Save a protocol object to disk, and prune any unused assets from
 * /assets/ sub directory.
 * @param {string} workingPath - working path in application /tmp/ dir
 * @param {object} protocol - The protocol object.
 */
const saveProtocol = (workingPath, protocol) =>
  new Promise((resolve, reject) => {
    log.info('saveProtocol()', workingPath);
    // save json to temp dir
    const destinationPath = path.join(workingPath, 'protocol.json');

    try {
      const protocolString = JSON.stringify(protocol, null, 2);

      resolve(
        writeFile(destinationPath, protocolString)
          .then(() =>
            // Now that the protocol is commited to disk we can safely prune unused assets.
            pruneAssets(workingPath),
          )
          .then(() => destinationPath),
      );
    } catch (e) {
      reject(e);
    }
  });

export default saveProtocol;
