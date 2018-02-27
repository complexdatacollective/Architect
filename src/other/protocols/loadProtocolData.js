import fs from 'fs';
import path from 'path';

const loadProtocolData = (protocolPath) => {
  const protocolFile = path.join(protocolPath, 'protocol.json');
  return JSON.parse(fs.readFileSync(protocolFile, 'utf8'));
};

export default loadProtocolData;
