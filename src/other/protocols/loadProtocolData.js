import fs from 'fs';
import path from 'path';

/**
 * Given a folder containing a `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} protocolPath - The protocol directory.
 * @returns {object} The protocol as an object
 */
const loadProtocolData = protocolPath =>
  new Promise((resolve, reject) => {
    const protocolFile = path.join(protocolPath, 'protocol.json');

    fs.readFile(protocolFile, 'utf8', (error, data) => {
      if (error) { reject(error); return; }

      resolve(JSON.parse(data));
    });
  });

export default loadProtocolData;
