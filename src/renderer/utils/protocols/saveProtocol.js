import path from 'path';
import log from 'electron-log';
import { writeFile } from 'fs-extra';
import pruneAssets from '@app/utils/protocols/pruneAssets';

const getStringifiedProtocol = (protocol) => new Promise((resolve, reject) => {
  try {
    return resolve(JSON.stringify(protocol, null, 2));
  } catch (e) {
    log.error(e);
    return reject(e);
  }
});

/**
 * Save a protocol object to disk, and prune any unused assets from
 * /assets/ sub directory.
 * @param {string} workingPath - working path in application /tmp/ dir
 * @param {object} protocol - The protocol object.
 */
const saveProtocol = (workingPath, protocol) => {
  // save json to temp dir
  const destinationPath = path.join(workingPath, 'protocol.json');
  log.info(`Save protocol to ${destinationPath}`);

  return getStringifiedProtocol(protocol)
    .then((protocolData) => writeFile(destinationPath, protocolData))
    .then(() => pruneAssets(workingPath))
    .then(() => destinationPath);
};

export default saveProtocol;
