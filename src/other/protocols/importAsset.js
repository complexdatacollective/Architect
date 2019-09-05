import path from 'path';
import uuid from 'uuid/v1';
import { findKey, get, toLower } from 'lodash';
import csvParse from 'csv-parse';
import { writeFile } from 'fs-extra';
import readFileAsBuffer from './lib/readFileAsBuffer';

const MIME_TYPES = [
  [/text\/csv/, 'network'],
  [/application\/json/, 'network'],
  [/text\/*,/, 'network'],
  [/image\/.*/, 'image'],
  [/audio\/.*/, 'audio'],
  [/video\/.*/, 'video'],
];

const EXTENSION_TYPES = {
  network: ['csv', 'json'],
  image: ['jpg', 'jpeg', 'gif', 'png'],
  audio: ['mp3', 'aiff'],
  video: ['mov', 'mp4'],
};

const getTypeFromMime = (mime, mimeTypes = MIME_TYPES) => {
  const match = mimeTypes.find(([matcher]) => matcher.test(mime));
  if (!match) { return null; }
  return match[1];
};

const getTypeFromExtension = (name, extensionTypes = EXTENSION_TYPES) => {
  const extension = toLower(path.extname(name).substring(1));
  return findKey(extensionTypes, type => type.includes(extension));
};

const getNetworkType = (file) => {
  const networkMimeTypes = [
    [/text\/csv/, 'csv'],
    [/application\/json/, 'json'],
    [/text\/*,/, 'csv'],
  ];

  const networkExtensionTypes = {
    json: ['json'],
    csv: ['csv'],
  };

  const networkType = getTypeFromMime(file.type, networkMimeTypes) ||
    getTypeFromExtension(file.name, networkExtensionTypes);

  return networkType;
};

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {buffer} file - The file buffer to copy.
 */
const importAsset = (protocolPath, file) => {
  const destinationName = `${uuid()}${path.extname(file.name)}`;
  const destinationPath = path.join(protocolPath, 'assets', destinationName);
  const assetType = getTypeFromMime(file.type) || getTypeFromExtension(file.name);

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
      reject(e);
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
      reject(e);
    }
  });

/**
 * Checks that imported asset is valid
 * @param {buffer} file - The file to check.
 */
export const validateAsset = (file) => {
  const assetType = getTypeFromMime(file.type) || getTypeFromExtension(file.name);

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
