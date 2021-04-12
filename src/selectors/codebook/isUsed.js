import { get, omit, cloneDeep } from 'lodash';
import { getForms } from '../reduxForm';
import { getProtocol } from '../protocol';
import { getIdsFromCodebook } from './helpers';

/**
 * Gets a key value object describing variables are
 * in use (including in redux forms)
 * @returns {object} in format: { [variableId]: boolean }
 */
export const makeGetIsUsed = (isUsedOptions = {}) => (state) => {
  const {
    formNames = ['edit-stage', 'editable-list-form'],
    excludePaths = [],
  } = isUsedOptions;

  const protocol = getProtocol(state);
  const forms = getForms(formNames)(state);
  const variableIds = getIdsFromCodebook(protocol.codebook);

  const data = excludePaths.length > 0
    ? omit(cloneDeep({ stages: protocol.stages, forms }), excludePaths)
    : { stages: protocol.stages, forms };

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
