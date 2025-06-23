import { app } from '~/app/api';
import { get } from 'lodash';

import codenames from '../codenames.json';

// Note: This is now async, so we'll need to refactor usage
const getAppVersion = async () => {
  const version = await app.getVersion();
  const codename = get(codenames, version, '');
  return { version, codename };
};

// For backward compatibility, provide a synchronous default
// This will need to be updated at usage sites
const appVersion = '6.0.0'; // fallback version
const codename = get(codenames, appVersion, '');

export default appVersion;

export {
  codename,
  appVersion,
  getAppVersion,
};
