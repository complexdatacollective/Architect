import path from 'path';
import { get } from 'lodash';
import { getNetworkVariables } from '@app/other/protocols/assetTools';
import { getActiveProtocolMeta } from './protocols';
import { getAssetManifest } from './protocol';

/**
 * Generate asset path using the assetManifest and protocol meta
 *
 * @param state redux state
 * @param {string} dataSource id of entry in assetManifest
 */
export const getAssetPath = (state, dataSource) => {
  const { workingPath } = getActiveProtocolMeta(state);
  const assetManifest = getAssetManifest(state);
  const asset = get(assetManifest, dataSource);

  if (!asset) { return null; }

  const assetPath = path.join(workingPath, 'assets', asset.source);
  return assetPath;
};

/**
 * Extract all unique variables from an external data network asset
 *
 * @param {Object} dataSource id of entry in assetManifest
 * @param {boolean} asOptions return variables as a label/value list
 */
export const makeGetNetworkAssetVariables = state =>
  async (dataSource, asOptions = false) => {
    const assetPath = getAssetPath(state, dataSource);
    const variables = await getNetworkVariables(assetPath);

    if (asOptions) {
      const variableOptions = variables
        .map(attribute => ({ label: attribute, value: attribute }));
      return variableOptions;
    }

    return variables;
  };
