import { remote } from 'electron';
import path from 'path';

const getLocalDirectory = protocolName => path.join(remote.getPath('temp'), protocolName);

export default getLocalDirectory;
