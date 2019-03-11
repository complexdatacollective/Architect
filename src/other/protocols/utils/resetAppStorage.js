/* eslint-disable import/prefer-default-export */
import { remote } from 'electron';
import fs from 'fs-extra';
import path from 'path';

const resetStorage = () => {
  const protocolPath = path.join(remote.app.getPath('temp'), 'protocols');
  fs.emptyDirSync(protocolPath);
};

export default resetStorage;
