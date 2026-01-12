import { get } from 'lodash';
import { electronAPI } from '@utils/electronBridge';
import codenames from '../codenames.json';

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

// For synchronous access after initialization
const getAppVersionSync = () => cachedVersion || 'unknown';
const getCodenameSync = () => cachedCodename || '';

// Initialize on module load (async)
getAppVersion();

export default getAppVersionSync;

export {
  getCodename,
  getAppVersion,
  getAppVersionSync,
  getCodenameSync,
  getAppVersionSync as appVersion,
};
