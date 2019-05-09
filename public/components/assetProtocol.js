const { protocol, app } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const log = require('./log');

const protocolName = 'asset'; // asset://

const validPaths = [
  app.getPath('userData'),
  app.getPath('temp'),
];

const isValidPath = filePath =>
  validPaths.reduce((memo, validPath) => memo || filePath.includes(validPath), false);

const registerProtocol = () =>
  protocol.registerFileProtocol(protocolName, (request, callback) => {
    const urlPath = request.url.substr(protocolName.length + 2);
    const filePath = path.normalize(urlPath);

    if (!isValidPath(filePath)) {
      log.error(`path outside of valid directories: "${filePath}"`);
      return;
    }

    fs.access(filePath, fs.constants.R_OK)
      .then(() => {
        log.info(`open ${protocolName}://`, filePath);
        callback({ path: filePath });
      })
      .catch(error => log.error(error));
  }, (error) => {
    if (error) {
      log.error(`Failed to register ${protocolName}:// protocol`);
    }
  });

exports.registerProtocol = registerProtocol;
