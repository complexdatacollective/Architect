import path from 'path';
import log from 'electron-log';
import { writeFile } from 'fs-extra';
import pruneAssets from '@app/other/protocols/pruneAssets';

/**
 * Save a protocol object to disk, and prune any unused assets from
 * /assets/ sub directory.
 * @param {string} workingPath - working path in application /tmp/ dir
 * @param {object} protocol - The protocol object.
 */
const saveProtocol = (workingPath, protocol) =>
  new Promise((resolve, reject) => {
    log.debug('saveProtocol()', workingPath);
    // save json to temp dir
    const destinationPath = path.join(workingPath, 'protocol.json');

    try {
      log.debug('  stringify protocol');
      const protocolString = JSON.stringify(protocol, null, 2);

      log.info(`save protocol to ${destinationPath}`);
      writeFile(destinationPath, protocolString)
        .then(() =>
          // Now that the protocol is commited to disk we can safely prune unused assets.
          pruneAssets(workingPath),
        )
        .then(() => resolve(destinationPath));
    } catch (e) {
      log.error(e);
      reject(e);
    }
  });

export default saveProtocol;
