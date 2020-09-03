/* eslint-disable import/prefer-default-export */

import path from 'path';
import { get } from 'lodash';
import csv from 'csvtojson';
import fs from 'fs-extra';
import { getVariableNamesFromNetwork, validateNames } from '@app/protocol-validation/validation/validateExternalData';
import { getSupportedAssetType } from '@app/other/protocols/importAsset';

/**
* Generate a switching function that takes a filepath as an argument
* and returns match from configuration object.
*/
const withExtensionSwitch = (configuration, fallback = () => Promise.resolve()) =>
  (filePath) => {
    const extension = path.extname(filePath).substr(1); // e.g. 'csv'

    return get(configuration, [extension], fallback);
  };


const readJsonNetwork = assetPath =>
  fs.readJson(assetPath);

const readCsvNetwork = async (assetPath) => {
  const data = await fs.readFile(assetPath);
  const nodes = await csv({ checkColumn: true })
    .fromString(data.toString('utf8'));

  return {
    nodes,
  };
};

/**
* Get validator based on filePath, if no validator available it resolves by default
* @param {string} filepath - The filename of the network asset
* @returns {string} - Returns a function that returns a promise.
*/
const getNetworkReader = withExtensionSwitch({
  csv: readCsvNetwork,
  json: readJsonNetwork,
});

/**
* Gets node variables from an external data source
* @param {buffer} file - The external data source
*/
export const getAssetVariables = async (filePath) => {
  const network = await getNetworkReader(filePath)(filePath);
  return getVariableNamesFromNetwork(network);
};

/**
* Checks that imported asset is valid
* @param {buffer} file - The file to check.
*/
export const validateAsset = async (filePath) => {
  const assetType = getSupportedAssetType(filePath);

  // Handle unsupported filePath types
  if (!assetType) {
    return Promise.reject(new Error('Asset type not supported'));
  }
  const networkReader = getNetworkReader(filePath);
  const network = await networkReader(filePath);

  if (get(network, 'nodes', []).length === 0 && get(network, 'edges', []).length === 0) {
    throw new Error("Network asset doesn't include any nodes or edges");
  }

  // check variable names
  const variableNames = getVariableNamesFromNetwork(network);

  const error = validateNames(variableNames);

  if (error) { throw new Error(error); }

  return true;
};
