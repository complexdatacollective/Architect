import path from 'path';
import { get, keys, uniq, flatMap } from 'lodash';
import fs from 'fs-extra';
import csv from 'csvtojson';
import { getAssetManifest, getActiveProtocolMeta } from './protocol';

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
  const assetPath = path.join(workingPath, 'assets', asset.source);
  return assetPath;
};

const getNeworkFromList = (nodes = [], edges = []) => {
  const nodesWithAttributes = nodes.map(
    node => ({ attributes: { ...node } }),
  );
  const edgesWithAttributes = edges.map(
    edge => ({ attributes: { ...edge } }),
  );

  return {
    nodes: nodesWithAttributes,
    edges: edgesWithAttributes,
  };
};

/**
 * Read external asset data and return as json network object
 *
 * @param {string} assetPath path to file on disk
 */
export const readExternalData = async (assetPath) => {
  const extname = path.extname(assetPath).toLowerCase();

  switch (extname) {
    case '.csv': {
      const csvData = await fs.readFile(assetPath);
      const items = await csv().fromString(csvData.toString('utf8'));
      // mock up network object that matches expected json format
      const network = getNeworkFromList(items);
      return network;
    }
    case '.json':
      return fs.readJson(assetPath);
    default:
      throw Error(`Unrecognized format '${extname}'`);
  }
};

/**
 * Extract all unique variables from an external data network asset
 *
 * @param {Object} externalData A network object { nodes: [], edges: [] }
 */
export const getVariablesFromExternalData = (externalData, entity = 'nodes') => {
  const items = externalData[entity] || [];
  const allAttributes = flatMap(
    items,
    item => (item.attributes && keys(item.attributes)) || [],
  );
  const uniqueAttributes = uniq(allAttributes);
  const variableOptions = uniqueAttributes
    .map(attribute => ({ label: attribute, value: attribute }));

  return variableOptions;
};
