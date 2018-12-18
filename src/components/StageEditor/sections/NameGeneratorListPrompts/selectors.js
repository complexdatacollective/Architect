/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { has, get, uniq, keys, map, mapValues, reduce } from 'lodash';
import { getExternalData, getVariableRegistry } from '../../../../selectors/protocol';

const getDataSource = (_, props) => props.dataSource;
const getNodeType = (_, props) => props.nodeType;

const getDataForDataSource = createSelector(
  getExternalData,
  getDataSource,
  (externalData, dataSource) =>
    get(externalData, dataSource, { nodes: [] }),
);

const getUniqueTypes = data =>
  uniq(map(data, 'type'));

/**
 * Create an index of types available in each data source
 */
const getTypesBySource = createSelector(
  getExternalData,
  getVariableRegistry,
  (externalData) => {
    const typesBySource = mapValues(
      externalData,
      data => new Set(getUniqueTypes(data.nodes)),
    );

    return typesBySource;
  },
);

/**
 * Create an index of types available in each data source
 */
const makeGetDataSourcesWithNodeType = () =>
  createSelector(
    getTypesBySource,
    getNodeType,
    (typesBySource, nodeType) => reduce(
      typesBySource,
      (acc, source, name) => {
        if (!source.has(nodeType)) { return acc; }
        return [...acc, name];
      },
      [],
    ),
  );

/**
 * Extracts unique variables used in `dataSource`, and combines them with the registry to
 * create list of options in the format: `[ { value, label }, ...]`
 */
const getExternalDataPropertyOptions = createSelector(
  getDataForDataSource,
  getVariableRegistry,
  getNodeType,
  (externalData, variableRegistry, nodeType) => {
    const dataVariables = externalData.nodes
      .filter(node => node.type === nodeType)
      .reduce((memo, node) => uniq([...memo, ...keys(node.attributes)]), []);

    const externalDataPropertyOptions = dataVariables.reduce(
      (acc, variableId) => {
        if (!has(variableRegistry, ['node', nodeType, 'variables', variableId])) { return acc; }

        const label = get(variableRegistry, ['node', nodeType, 'variables', variableId, 'name'], variableId);

        return [
          ...acc,
          {
            label,
            value: variableId,
          },
        ];
      },
      [],
    );

    return externalDataPropertyOptions;
  },
);

export {
  makeGetDataSourcesWithNodeType,
  getExternalDataPropertyOptions,
};
