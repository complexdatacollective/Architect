import { electronAPI } from '@utils/electronBridge';
import { get } from 'lodash';

import codenames from '../codenames';

let cachedVersion = null;
let cachedCodename = null;

const getAppVersion = async () => {
  if (cachedVersion === null) {
    cachedVersion = await electronAPI.app.getVersion();
    cachedCodename = get(codenames, cachedVersion, '');
  }
  return cachedVersion;
};

const getCodename = async () => {
  if (cachedCodename === null) {
    await getAppVersion();
  }
  return cachedCodename;
};

// Initialize on module load (async)
getAppVersion();

export { getCodename, getAppVersion };
