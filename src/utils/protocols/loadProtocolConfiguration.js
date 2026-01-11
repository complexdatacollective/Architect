import { electronAPI } from '@utils/electronBridge';

/**
 * Given a folder containing a `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} protocolPath - The protocol directory.
 * @returns {object} The protocol as an object
 */
const loadProtocolConfiguration = async (protocolPath) => {
  const protocolFile = await electronAPI.path.join(protocolPath, 'protocol.json');

  return electronAPI.fs.readJson(protocolFile);
};

export default loadProtocolConfiguration;
