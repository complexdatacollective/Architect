import fs from 'fs-extra';
import path from 'path';

/**
 * Given a folder containing a `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} protocolPath - The protocol directory.
 * @returns {object} The protocol as an object
 */
const loadProtocolConfiguration = (protocolPath) => {
  const protocolFile = path.join(protocolPath, 'protocol.json');

  return fs.readJson(protocolFile);
};

export default loadProtocolConfiguration;
