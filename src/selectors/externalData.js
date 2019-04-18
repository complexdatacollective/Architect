/* eslint-disable import/prefer-default-export */

import path from 'path';
import { get, keys, uniq, flatMap } from 'lodash';
import fs from 'fs-extra';
import csv from 'csvtojson';
import { getAssetManifest, getActiveProtocolMeta } from './protocol';

// id: action.id,
// type: action.assetType,
// name: action.name,
// source: action.filename,

export const getExternalData = async (assetPath) => {
  const extname = path.extname(assetPath).toLowerCase();

  switch (extname) {
    case '.csv': {
      const csvData = await fs.readFile(assetPath);
      return csv().fromString(csvData.toString('utf8'));
    }
    case '.json':
      return fs.readJson(assetPath);
    default:
      throw Error(`Unrecognized format '${extname}'`);
  }
};

export const getAssetPath = (state, dataSource) => {
  const { workingPath } = getActiveProtocolMeta(state);
  const assetManifest = getAssetManifest(state);
  const asset = get(assetManifest, dataSource);
  const assetPath = path.join(workingPath, 'assets', asset.source);
  return assetPath;
};

export const getVariablesFromExternalData = (externalData) => {
  const allAttributes = flatMap(externalData, item => keys(item));
  const uniqueAttributes = uniq(allAttributes);
  const variableOptions = uniqueAttributes
    .map(attribute => ({ label: attribute, value: attribute }));

  return variableOptions;
};
