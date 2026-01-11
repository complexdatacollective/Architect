import log from '@utils/logger';
import { electronAPI } from '@utils/electronBridge';
import pruneAssets from '@app/utils/protocols/pruneAssets';

const getStringifiedProtocol = (protocol) => {
  try {
    return JSON.stringify(protocol, null, 2);
  } catch (e) {
    log.error(e);
    throw e;
  }
};

/**
 * Save a protocol object to disk, and prune any unused assets from
 * /assets/ sub directory.
 * @param {string} workingPath - working path in application /tmp/ dir
 * @param {object} protocol - The protocol object.
 */
const saveProtocol = async (workingPath, protocol) => {
  const destinationPath = await electronAPI.path.join(workingPath, 'protocol.json');
  log.info(`Save protocol to ${destinationPath}`);

  const protocolData = getStringifiedProtocol(protocol);
  await electronAPI.fs.writeFile(destinationPath, protocolData);
  await pruneAssets(workingPath);

  return destinationPath;
};

export default saveProtocol;
