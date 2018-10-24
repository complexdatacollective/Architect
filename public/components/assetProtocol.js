const electron = require('electron');
const fs = require('fs');
const log = require('./log');

const registerAssetProtocol = () =>
  electron.protocol.registerFileProtocol('asset', (request, callback) => {
    const filePath = request.url.substr(7);

    // eslint-disable-next-line
    fs.access(filePath, fs.constants.R_OK, (error) => {
      if (error) { console.log(error); }
      log.info('open asset://', filePath);
      callback({ path: filePath });
    });
  }, (error) => {
    if (error) {
      log.error('Failed to register protocol');
    }
  });

exports.registerAssetProtocol = registerAssetProtocol;
