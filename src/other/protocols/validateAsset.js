import path from 'path';
import { get, first } from 'lodash';
import csvParse from 'csv-parse';
import { readFile } from 'fs-extra';
import { getVariableNamesFromNetwork, validateNames } from '@app/protocol-validation/validation/validateExternalData';
import { getSupportedAssetType } from '@app/other/protocols/importAsset';

const validateJson = data =>
  new Promise((resolve, reject) => {
    try {
      const network = JSON.parse(data);

      if (get(network, 'nodes', []).length === 0 && get(network, 'edges', []).length === 0) {
        return reject(new Error("JSON network asset doesn't include any nodes or edges"));
      }

      // check variable names
      const variableNames = getVariableNamesFromNetwork(network);

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
      csvParse(data, { trim: true }, (err, tableData) => {
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
const validateAsset = (filePath) => {
  const assetType = getSupportedAssetType(filePath);

  // Handle unsupported filePath types
  if (!assetType) {
    return Promise.reject(new Error('Asset type not supported'));
  }

  const assetValidator = getAssetValidator(filePath);

  return readFile(filePath)
    .then(assetValidator);
};

export default validateAsset;
