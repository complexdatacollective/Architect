/* eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect';
import { get, uniq, keys } from 'lodash';
import { getExternalData, getVariableRegistry } from '../../../../selectors/protocol';

const getDataSource = (_, props) => props.dataSource;
const getNodeType = (_, props) => props.nodeType;

const getDataForDataSource = createSelector(
  getExternalData,
  getDataSource,
  (externalData, dataSource) =>
    get(externalData, dataSource, { nodes: [] }),
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
    const dataAttributes = externalData.nodes
      .filter(node => node.type === nodeType)
      .reduce((memo, node) => uniq([...memo, ...keys(node.attributes)]), []);

    const externalDataPropertyOptions = dataAttributes.map(
      (attributeId) => {
        const label = get(variableRegistry, ['node', nodeType, 'variables', attributeId, 'name']);

        if (!label) { throw new Error(`"${attributeId}" couldn't be found in variable registry.`); }

        return {
          label,
          value: attributeId,
        };
      },
    );

    return externalDataPropertyOptions;
  },
);

export { getExternalDataPropertyOptions };
