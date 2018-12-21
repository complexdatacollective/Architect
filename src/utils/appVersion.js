import { remote } from 'electron';
import { get } from 'lodash';

const codenames = {
  '4.0.0-alpha.2': 'Anning',
  '4.0.0-alpha.3': 'Hercules',
  '4.0.0-alpha.4': 'Gold-Bug',
  // Skip versions to sync with Network Canvas
  '4.0.0-alpha.8': 'Lochs & Glens',
  '4.0.0-alpha.9': 'Arrakis',
  '4.0.0-alpha.10': 'Porthleven',
};

const appVersion = remote.app.getVersion();
const codename = get(codenames, appVersion, 'Codename');

export default appVersion;

export {
  codename,
  appVersion,
};
