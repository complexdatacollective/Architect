import { createSelector } from 'reselect';
import { get, uniq, map, mapValues, reduce } from 'lodash';
import { getExternalData, getVariableRegistry } from '../../../../selectors/protocol';
import { LABEL_VARIABLE_TYPES } from '../../../../config';

const getUniqueTypes = data =>
  uniq(map(data, 'type'));

const getNodeType = (_, props) => props.nodeType;

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
 * Return a list of options for the current props.nodeType
 */
const makeGetDataSourcesWithNodeTypeOptions = () =>
  createSelector(
    getTypesBySource,
    getNodeType,
    (typesBySource, nodeType) => reduce(
      typesBySource,
      (acc, source, name) => {
        if (!source.has(nodeType)) { return acc; }
        return [
          ...acc,
          { label: name, value: name },
        ];
      },
      [],
    ),
  );

/**
 * Extracts unique variables used in `dataSource`, and combines them with the registry to
 * create list of options in the format: `[ { value, label }, ...]`
 */
const makeGetExternalDataPropertyOptions = () =>
  createSelector(
    getVariableRegistry,
    getNodeType,
    (variableRegistry, nodeType) => {
      const variables = get(variableRegistry, ['node', nodeType, 'variables'], {});

      const externalDataPropertyOptions = reduce(
        variables,
        (acc, variable, variableId) => {
          const label = get(variable, 'name', variableId);
          const type = variable && variable.type;

          // Only allow text fields for label.
          if (!LABEL_VARIABLE_TYPES.has(type)) { return acc; }

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
  makeGetDataSourcesWithNodeTypeOptions,
  makeGetExternalDataPropertyOptions,
};
