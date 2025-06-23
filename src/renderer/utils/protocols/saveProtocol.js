import log from 'electron-log';
import { path, fileSystem } from '~/app/api';
import pruneAssets from '~/app/utils/protocols/pruneAssets';

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
const saveProtocol = async (workingPath, protocol) => {
  // save json to temp dir
  const destinationPath = await path.join(workingPath, 'protocol.json');
  log.info(`Save protocol to ${destinationPath}`);

  const protocolData = await getStringifiedProtocol(protocol);
  await fileSystem.writeFile(destinationPath, protocolData);
  await pruneAssets(workingPath);
  return destinationPath;
};

export default saveProtocol;
