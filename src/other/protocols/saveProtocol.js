import path from 'path';
import { writeFile } from '../filesystem';

/**
 * Given a protocol object save that over the protocol at protocolPath
 * @param {string} protocolPath - The destination directory.
 * @param {object} protocol - The protocol itself.
 */
const saveProtocol = (protocolPath, protocol) => {
  const destinationPath = path.join(protocolPath, 'protocol.json');

  return writeFile(destinationPath, JSON.stringify(protocol, null, 2));
};

export default saveProtocol;
