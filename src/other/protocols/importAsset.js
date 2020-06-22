import path from 'path';
import uuid from 'uuid/v1';
import { findKey, get, toLower, first } from 'lodash';
import csvParse from 'csv-parse';
import { copy, readFile } from 'fs-extra';
import { SUPPORTED_EXTENSION_TYPE_MAP } from '@app/config';
import { allowedNMToken } from '@app/utils/validations';

const variableValidator = allowedNMToken();

/**
 * Function that determines the type of an asset file when importing. Types are defined
 * as one of 'network', 'image', 'audio', or video.
 *
 * Uses the mime type where possible, and falls back to the file extension.
 *
 * @param {string} asset - the filename of the asset
 * @return {string} Returns one of network, image, audio, video or returns false if type
 * is unsupported
 */
const getSupportedAssetType = (filePath) => {
  const extension = toLower(path.extname(filePath));

  const typeFromMap = findKey(SUPPORTED_EXTENSION_TYPE_MAP, type => type.includes(extension));

  return typeFromMap || false;
};

/**
 * Makes a copy of a file buffer to `protocolPath`
 * @param {string} protocolPath - The destination directory.
 * @param {string} filePath - The file buffer to copy.
 */
const importAsset = (protocolPath, filePath) =>
  new Promise((resolve) => {
    const destinationName = `${uuid()}${path.extname(filePath)}`;
    const destinationPath = path.join(protocolPath, 'assets', destinationName);
    const assetType = getSupportedAssetType(filePath);

    copy(filePath, destinationPath)
      .then(() => ({ filePath: destinationName, assetType }))
      .then(resolve);
  });

const getUniqueAttributes = (items) => {
  const uniqueSet = items.reduce(
    (acc, node) => {
      Object.keys(node)
        .forEach(key => acc.add(key));
      return acc;
    },
    new Set([]),
  );

  return Array.from(uniqueSet);
};

const validateNames = (items) => {
  const errors = items
    .filter(item => variableValidator(item) !== undefined);

  if (errors.length === 0) { return false; }

  return `Variable name not allowed ("${errors.join('", "')}"). Only letters, numbers and the symbols ._-: are supported.`;
};

const validateJson = data =>
  new Promise((resolve, reject) => {
    try {
      const network = JSON.parse(data);

      if (get(network, 'nodes', []).length === 0 && get(network, 'edges', []).length === 0) {
        return reject(new Error("JSON network asset doesn't include any nodes or edges"));
      }

      // check variable names
      const variableNames = ['nodes', 'edges'].flatMap(
        entity => getUniqueAttributes(get(network, entity, [])),
      );

      const error = validateNames(variableNames);

      if (error) { return reject(new Error(error)); }

      // Check option values
      // Not needed at this point, as unsupported feature

      return resolve(true);
    } catch (e) {
      return reject(e);
    }
  });

const validateCsv = data =>
  new Promise((resolve, reject) => {
    try {
      csvParse(data, (err, tableData) => {
        if (err) {
          return reject(new Error(err));
        }

        const firstRow = first(tableData);

        // Check heading (variables) are valid
        const error = validateNames(firstRow);

        if (error) { return reject(new Error(error)); }

        return resolve(true);
      });
    } catch (e) {
      reject(e);
    }
  });

/**
 * Get validator based on filePath, if no validator available it resolves by default
 * @param {string} filepath - The filename of the network asset
 * @returns {string} - Returns a function that returns a promise.
 */
const getAssetValidator = (filePath) => {
  const extension = path.extname(filePath).substr(1); // e.g. 'csv'

  switch (extension) {
    case 'csv':
      return validateCsv;
    case 'json':
      return validateJson;
    default:
      // Don't validate non-network assets at this time
      return () => Promise.resolve();
  }
};

/**
 * Checks that imported asset is valid
 * @param {buffer} file - The file to check.
 */
export const validateAsset = (filePath) => {
  const assetType = getSupportedAssetType(filePath);

  // Handle unsupported filePath types
  if (!assetType) {
    return Promise.reject(new Error('Asset type not supported'));
  }

  const assetValidator = getAssetValidator(filePath);

  return readFile(filePath)
    .then(assetValidator);
};

export default importAsset;
