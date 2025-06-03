/* eslint-disable import/prefer-default-export */

import path from 'path';
import { first, get } from 'lodash';
import csvParse from 'csv-parse';
import { readFile } from 'fs-extra';
import { getVariableNamesFromNetwork } from '@codaco/protocol-validation';

/**
* Generate a switching function that takes a filepath as an argument
* and returns match from configuration object.
*/
const withExtensionSwitch = (configuration, fallback = () => Promise.resolve()) => (filePath) => {
  const extension = path.extname(filePath).substr(1); // e.g. 'csv'

  return get(configuration, [extension], fallback);
};

const readJsonVariables = (data) => new Promise((resolve, reject) => {
  try {
    const network = JSON.parse(data);

    const variableNames = getVariableNamesFromNetwork(network);

    return resolve(variableNames);
  } catch (e) {
    return reject(e);
  }
});

const readCsvVariables = (data) => new Promise((resolve, reject) => {
  try {
    csvParse(data, { trim: true }, (err, tableData) => {
      const firstRow = first(tableData);

      return resolve(firstRow);
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
const getVariableReader = withExtensionSwitch({
  csv: readCsvVariables,
  json: readJsonVariables,
});

/**
* Gets node variables from an external data source
* @param {buffer} file - The external data source
*/
export const getAssetVariables = (filePath) => {
  const variableReader = getVariableReader(filePath);

  return readFile(filePath)
    .then(variableReader);
};
