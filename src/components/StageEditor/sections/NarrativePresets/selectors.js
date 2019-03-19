import { get, map, reduce } from 'lodash';
import { getCodebook } from '../../../../selectors/protocol';

// TODO: refactor this to use new selector
export const getVariablesForNodeType = (state, props) => {
  const nodeType = props.nodeType;
  const codebook = getCodebook(state);
  return get(codebook, ['node', nodeType, 'variables'], {});
};

const asOption = (value, key) =>
  ({
    label: get(value, 'name', ''),
    value: key,
    color: get(value, 'color', ''),
  });

const filterAsOption = rule =>
  (memo, item, id) => {
    if (!rule(item)) { return memo; }
    return [
      ...memo,
      asOption(item, id),
    ];
  };

export const getLayoutVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props);

  return reduce(
    variables,
    filterAsOption(item => item.type === 'layout'),
    [],
  );
};

export const getHighlightVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props);

  return reduce(
    variables,
    filterAsOption(item => item.type === 'boolean'),
    [],
  );
};

export const getGroupVariablesForNodeType = (state, props) => {
  const variables = getVariablesForNodeType(state, props);

  const options = reduce(
    variables,
    filterAsOption(item => item.type === 'categorical'),
    [{ label: '\u2014 None \u2014', value: '' }],
  );

  return options;
};

export const getEdgesForNodeType = (state) => {
  const codebook = getCodebook(state);

  return map(codebook.edge, asOption);
};
