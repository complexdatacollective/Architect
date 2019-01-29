import { createSelector } from 'reselect';
import { get, map, reduce } from 'lodash';
import { getNetworkAssets, getVariableRegistry } from '../../../../selectors/protocol';
import { LABEL_VARIABLE_TYPES } from '../../../../config';

const getNodeType = (_, props) => props.nodeType;

/**
 * Return a list of options for the current props.nodeType
 */
const getNetworkOptions = (state) => {
  const networkAssets = getNetworkAssets(state);

  return map(
    networkAssets,
    (asset, name) => ({
      label: asset.name,
      value: name,
    }),
  );
};

/**
 * Create list of options for attributes from the variable registry in
 * the format: `[ { value, label }, ...]`
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
  getNetworkOptions,
  makeGetExternalDataPropertyOptions,
};
