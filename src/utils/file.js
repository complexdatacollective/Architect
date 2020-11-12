import { remote } from 'electron';
import fse from 'fs-extra';
import log from 'electron-log';
import path from 'path';
import uuid from 'uuid';
import pruneAssets from '@app/utils/protocols/pruneAssets';
import { archive, extract } from '@app/utils/protocols/lib/archive';
import validateProtocol from '@app/utils/validateProtocol';

const getStringifiedProtocol = protocol =>
  new Promise((resolve, reject) => {
    try {
      return resolve(JSON.stringify(protocol, null, 2));
    } catch (e) {
      log.error(e);
      return reject(e);
    }
  });

/**
 * @param {string} workingPath - working path in application /tmp/protocols/ dir
 * @param {object} protocol - The protocol object.
 */
export const exportNetcanvas = (workingPath, protocol) => {
  const exportPath = path.join(remote.app.getPath('temp'), 'export', uuid());
  const protocolJsonPath = path.join(workingPath, 'protocol.json');
  log.info(`Save protocol object to ${protocolJsonPath}`);

  return getStringifiedProtocol(protocol)
    .then(protocolData => fse.writeFile(protocolJsonPath, protocolData))
    .then(() => pruneAssets(workingPath))
    .then(() => archive(workingPath, exportPath))
    .then(() => exportPath);
};


/**
 * Create a working copy of a protocol in the application
 * tmp directory. If bundled, extract it, if not, copy it.
 *
 * @param filePath .netcanvas file path
 *
 * @returns A promise which resolves to the destination path.
 */
export const importNetcanvas = (filePath) => {
  const destinationPath = path.join(remote.app.getPath('temp'), 'protocols', uuid());

  return fse.access(filePath, fse.constants.R_OK)
    .then(() => {
      if (path.extname(filePath) === '.netcanvas') {
        return extract(filePath, destinationPath);
      }

      return fse.copy(filePath, destinationPath);
    })
    .then(() => destinationPath);
};


/**
 * Given the working path for a protocol (in /tmp/protocols `protocol.json`,
 * returns a promise that resolves to the parsed json object
 * @param {string} protocolPath - The protocol directory.
 * @returns {object} The protocol as an object
 */
export const readProtocol = (protocolPath) => {
  const protocolFile = path.join(protocolPath, 'protocol.json');

  return fse.readJson(protocolFile);
};

/**
 * Read a netcanvas file, extract it and try to read protocol.json
 * @param filePath - .netcanvas file path
 * @returns {Promise} Resolves to true if protocol is read successfully
 */
export const verifyNetcanvas = filePath =>
  importNetcanvas(filePath)
    .then(readProtocol)
    .then(validateProtocol)
    .then(() => true);
