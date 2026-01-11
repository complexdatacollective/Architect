import { get } from 'lodash';
import { pathSync } from '@utils/electronBridge';
import { getNetworkVariables, getGeoJsonVariables } from '@app/utils/protocols/assetTools';
import { getWorkingPath } from './session';
import { getAssetManifest } from './protocol';

/**
 * Generate asset path using the assetManifest and protocol meta
 *
 * @param state redux state
 * @param {string} dataSource id of entry in assetManifest
 */
export const getAssetPath = (state, dataSource) => {
  const workingPath = getWorkingPath(state);
  const assetManifest = getAssetManifest(state);
  const asset = get(assetManifest, dataSource);

  if (!asset) { return null; }

  const assetPath = pathSync.join(workingPath, 'assets', asset.source);
  return assetPath;
};

/**
 * Extract all unique variables from an external data network asset
 *
 * @param {Object} dataSource id of entry in assetManifest
 * @param {boolean} asOptions return variables as a label/value list
 */
export const makeGetNetworkAssetVariables = (state) => async (dataSource, asOptions = false) => {
  const assetPath = getAssetPath(state, dataSource);

  if (!assetPath) { return null; }

  const variables = await getNetworkVariables(assetPath);

  if (asOptions) {
    const variableOptions = variables
      .map((attribute) => ({ label: attribute, value: attribute }));
    return variableOptions;
  }

  return variables;
};

export const makeGetGeoJsonAssetVariables = (state) => async (dataSource) => {
  const assetPath = getAssetPath(state, dataSource);

  if (!assetPath) { return null; }

  const variables = await getGeoJsonVariables(assetPath);

  const variableOptions = variables
    .map((attribute) => ({ label: attribute, value: attribute }));

  return variableOptions;
};
