const { protocol, app } = require('electron');
const fs = require('fs');
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
    const decodedURI = decodeURIComponent(request.url.substr(protocolName.length + 2));
    const filePath = path.normalize(decodedURI);

    if (!isValidPath(filePath)) {
      throw new Error('path outside of valid directories');
    }

    // eslint-disable-next-line
    fs.access(filePath, fs.constants.R_OK, (error) => {
      if (error) { console.log(error); }
      log.info(`open ${protocolName}://`, filePath);
      callback({ path: filePath });
    });
  }, (error) => {
    if (error) {
      log.error(`Failed to register ${protocolName}:// protocol`);
    }
  });

exports.registerProtocol = registerProtocol;
