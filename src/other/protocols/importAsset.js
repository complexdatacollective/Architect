import path from 'path';
import uuid from 'uuid/v1';
import log from 'electron-log';
import { findKey, get } from 'lodash';
import csvParse from 'csv-parse';
import { writeFile } from 'fs-extra';
import readFileAsBuffer from './lib/readFileAsBuffer';

// Remember to also update getNetworkType!
const SUPPORTED_MIME_TYPE_MAP = {
  network: ['application/json', 'text/csv', 'text/*,', 'application/vnd.ms-excel'],
  image: ['image/*'],
  audio: ['audio/*'],
  video: ['video/*'],
};

// Remember to also update getNetworkType!
const SUPPORTED_EXTENSION_TYPE_MAP = {
  network: ['.csv', '.json'],
  image: ['.jpg', '.jpeg', '.gif', '.png'],
  audio: ['.mp3', '.aiff'],
  video: ['.mov', '.mp4'],
};

// Returns one of network, image, audio, video or returns false if type is unsupported
const getSupportedAssetType = (asset) => {
  const extension = path.extname(asset.name);
  const mimeType = asset.type;

  const typeFromMap = findKey(SUPPORTED_EXTENSION_TYPE_MAP, type => type.includes(extension)) ||
  findKey(SUPPORTED_MIME_TYPE_MAP, type => type.includes(mimeType));

  return typeFromMap || false;
};

// Returns either json or csv, or undefined
const getNetworkType = (file) => {
  const extension = path.extname(file.name);
  const mimeType = file.type;

  const NETWORK_TYPE_MAP = {
    json: ['application/json', '.json'],
    csv: ['text/csv', 'text/*,', 'application/vnd.ms-excel', '.csv'],
  };

  return findKey(NETWORK_TYPE_MAP, type => type.includes(mimeType) || type.includes(extension));
};

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {buffer} file - The file buffer to copy.
 */
const importAsset = (protocolPath, file) => {
  const destinationName = `${uuid()}${path.extname(file.name)}`;
  const destinationPath = path.join(protocolPath, 'assets', destinationName);
  const assetType = getSupportedAssetType(file);

  return readFileAsBuffer(file)
    .then(data => writeFile(destinationPath, data))
    .then(() => ({ filePath: destinationName, assetType }));
};

const validateJson = data =>
  new Promise((resolve, reject) => {
    try {
      const network = JSON.parse(data);

      if (get(network, 'nodes', []).length === 0 && get(network, 'edges', []).length === 0) {
        throw new Error("JSON network asset doesn't include any nodes or edges");
      }

      resolve(true);
    } catch (e) {
      log.error('  ERROR', e);
      reject('validationError');
    }
  });

const validateCsv = data =>
  new Promise((resolve, reject) => {
    try {
      csvParse(data, (err) => {
        if (err) {
          throw new Error(err);
        }

        resolve(true);
      });
    } catch (e) {
      log.error('  ERROR', e);
      reject('validationError');
    }
  });

/**
 * Checks that imported asset is valid
 * @param {buffer} file - The file to check.
 */
export const validateAsset = (file) => {
  const assetType = getSupportedAssetType(file);

  // Handle unsupported file types
  if (!assetType) {
    return Promise.reject('unsupportedError');
  }

  if (assetType !== 'network') { return Promise.resolve(true); }


  const networkType = getNetworkType(file);

  return readFileAsBuffer(file)
    .then((data) => {
      if (networkType === 'json') {
        return validateJson(data);
      }

      return validateCsv(data);
    })
    .then(() => file);
};

export default importAsset;
