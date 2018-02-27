import fs from 'fs';
import path from 'path';

/**
 * Given a folder containing a `protocol.json`, returns that (json parsed) file as an object
 * @param {string} protocolPath - The protocol directory.
 */
const loadProtocolData = (protocolPath) => {
  const protocolFile = path.join(protocolPath, 'protocol.json');
  return JSON.parse(fs.readFileSync(protocolFile, 'utf8'));
};

export default loadProtocolData;
