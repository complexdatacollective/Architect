/* eslint-disable import/prefer-default-export */

import path from 'path';
import { get } from 'lodash';
import csv from 'csvtojson';
import fs from 'fs-extra';
import { getVariableNamesFromNetwork, validateNames } from '@codaco/protocol-validation';
import { getSupportedAssetType } from '@app/utils/protocols/importAsset';

/**
* Generate a switching function that takes a filepath as an argument
* and returns match from configuration object.
*/
const withExtensionSwitch = (
  configuration, fallback = () => Promise.resolve(),
) => (filePath, ...rest) => {
  if (!filePath) { return null; }
  const extension = path.extname(filePath).substr(1); // e.g. 'csv'

  const f = get(configuration, [extension], fallback);
  return f(filePath, ...rest);
};

const readJsonNetwork = (assetPath) => fs.readJson(assetPath);

const readCsvNetwork = async (assetPath) => {
  const data = await fs.readFile(assetPath);
  const nodes = await csv({ checkColumn: true })
    .fromString(data.toString('utf8'))
    .then(
      (rows) => rows.map((attributes) => ({ attributes })),
    )
    .catch((e) => {
      if (e.toString().includes('column_mismatched')) {
        e.code = 'COLUMN_MISMATCHED';
      }
      throw e;
    });

  return {
    nodes,
  };
};

/**
* Get validator based on filePath, if no validator available it resolves by default
* @param {string} filepath - The filename of the network asset
* @returns {string} - Returns a function that returns a promise.
*/
export const networkReader = withExtensionSwitch({
  csv: readCsvNetwork,
  json: readJsonNetwork,
});

/**
* Gets node variables from an external data source
* @param {buffer} file - The external data source
*/
export const getNetworkVariables = async (filePath) => {
  const network = await networkReader(filePath);

  if (!network) { return null; }
  return getVariableNamesFromNetwork(network);
};

const validateNetwork = async (filePath) => {
  const network = await networkReader(filePath);

  if (get(network, 'nodes', []).length === 0 && get(network, 'edges', []).length === 0) {
    throw new Error("Network asset doesn't include any nodes or edges");
  }

  // check variable names
  const variableNames = getVariableNamesFromNetwork(network);

  const errorString = validateNames(variableNames);

  if (errorString) {
    const error = new Error(errorString);
    error.code = 'VARIABLE_NAME';
    throw error;
  }

  return true;
};

/**
* Checks that imported asset is valid
* @param {buffer} file - The file to check.
*/
export const validateAsset = async (filePath) => {
  const assetType = getSupportedAssetType(filePath);

  if (!assetType) {
    throw new Error('Asset type not supported');
  }

  if (assetType === 'network') {
    await validateNetwork(filePath);
  }

  return true;
};

export const getGeoJsonVariables = async (filePath) => {
  // process GeoJSON
  const geoJson = await fs.readJson(filePath);
  return Object.keys(geoJson.features[0].properties);
};
