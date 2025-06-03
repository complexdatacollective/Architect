const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const log = require('./log');

const loadDevTools = () => {
  console.log('loadDevTool');
  if (process.env.NODE_ENV !== 'development' || process.env.DISABLE_DEV_TOOLS === 'true') {
    console.log('  abort');
    return Promise.resolve(null);
  }

  console.log('  install extensions');

  return Promise.all([
    installExtension(REACT_DEVELOPER_TOOLS),
    installExtension(REDUX_DEVTOOLS),
  ])
    .then(tools => log.info(`Added Extension:  ${tools.toString()}`))
    .catch((err) => {
      log.warn('An error occurred: ', err);
    });
};

module.exports = loadDevTools;
