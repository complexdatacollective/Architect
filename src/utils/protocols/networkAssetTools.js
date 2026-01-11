/* eslint-disable import/prefer-default-export */

import { first, get } from 'lodash';
import csvParse from 'csv-parse';
import { electronAPI } from '@utils/electronBridge';
import { getVariableNamesFromNetwork } from '@codaco/protocol-validation';

/**
* Generate a switching function that takes a filepath as an argument
* and returns match from configuration object.
*/
const withExtensionSwitch = (
  configuration, fallback = () => Promise.resolve(),
) => async (filePath) => {
  const extname = await electronAPI.path.extname(filePath);
  const extension = extname.substr(1); // e.g. 'csv'

  return get(configuration, [extension], fallback);
};

const readJsonVariables = (data) => {
  const network = JSON.parse(data);
  return getVariableNamesFromNetwork(network);
};

const readCsvVariables = (data) => new Promise((resolve, reject) => {
  csvParse(data, { trim: true }, (err, tableData) => {
    if (err) {
      reject(err);
      return;
    }
    const firstRow = first(tableData);
    resolve(firstRow);
  });
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
export const getAssetVariables = async (filePath) => {
  const variableReader = await getVariableReader(filePath);
  const data = await electronAPI.fs.readFile(filePath, 'utf8');
  return variableReader(data);
};
