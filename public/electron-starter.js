const log = require('./components/log');
const AppManager = require('./components/appManager');

global.NETWORK_CANVAS_PREVIEW = true;

log.info('App starting...');

AppManager();
