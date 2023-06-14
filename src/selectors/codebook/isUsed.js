import { get, omit, cloneDeep } from 'lodash';
import { getForms } from '../reduxForm';
import { getCodebook, getProtocol } from '../protocol';
import { getIdsFromCodebook } from './helpers';

/**
 * Gets a key value object describing variables are
 * in use (including in redux forms).
 *
 * Naive implementation: just checks if the variable id is in the flattened
 * protocol, or any redux forms.
 *
 * JRM BUGFIX: This previously did not check for `sameAs` or `differentFrom`
 * variable references that are contained within codebook variable definitions.
 * This caused a bug where these variables were able to be removed, creating
 * references to variables that no longer existed.
 *
 * @param {object} options  - options object
 * @param {Array} options.formNames - names of forms to check for variable usage
 * @param {Array} options.excludePaths - paths to exclude from the check (e.g. 'stages')
 *
 * @returns {function} - selector function that returns a key value object
 * describing variables are in use
 */
export const makeGetIsUsed = (options = {}) => (state) => {
  const {
    formNames = ['edit-stage', 'editable-list-form'],
    excludePaths = [],
  } = options;

  const protocol = getProtocol(state);
  const forms = getForms(formNames)(state);
  const variableIds = getIdsFromCodebook(protocol.codebook);
  const codebook = getCodebook(state);

  // Get all codebook[entityType][entityId].variables.validation references
  const variableValidations = () => {
    const validations = [];
    const getEntityVariableValidations = (entityDefinition) => {
      if (!entityDefinition.variables) {
        return [];
      }

      return Object.values(entityDefinition.variables).reduce((memo, variable) => {
        if (variable.validation) {
          memo.push(variable.validation);
        }
        return memo;
      }, []);
    };

    Object.keys(codebook).forEach((entityType) => {
      if (entityType === 'ego') {
        validations.push(...getEntityVariableValidations(codebook[entityType]));
      }

      Object.keys(codebook[entityType]).forEach((entityId) => {
        validations.push(...getEntityVariableValidations(codebook[entityType][entityId]));
      });
    });

    return validations;
  };

  const searchLocations = { stages: protocol.stages, forms, validations: variableValidations() };

  const data = excludePaths.length > 0
    ? omit(cloneDeep(
      searchLocations,
    ), excludePaths)
    : searchLocations;

  const flattenedData = JSON.stringify(data);

  const isUsed = variableIds.reduce(
    (memo, variableId) => ({
      ...memo,
      [variableId]: flattenedData.includes(`"${variableId}"`),
    }),
    {},
  );

  return isUsed;
};

export const makeOptionsWithIsUsed = (isUsedOptions = {}) => (state, options) => {
  const isUsed = makeGetIsUsed(isUsedOptions)(state);
  return options.map(
    ({ value, ...rest }) => ({ ...rest, value, isUsed: get(isUsed, value) }),
  );
};
