import { omit, get, omitBy } from 'lodash';
import { withHandlers, defaultProps, compose } from 'recompose';
import { connect } from 'react-redux';
import { getCodebook } from '../../selectors/protocol';

const validTypes = [
  'ordinal',
  'categorical',
  'boolean',
  'text',
  'number',
];

const defaultsByType = {
  boolean: true,
  ordinal: [],
  text: '',
  number: '',
};

const getVariableDefault = (variableMeta) => {
  if (variableMeta.default) { return variableMeta.default; }
  return get(defaultsByType, variableMeta.type, '');
};

const getVariablesForNodeType = (state, nodeType) => {
  const codebook = getCodebook(state);
  return get(codebook, ['node', nodeType, 'variables'], {});
};

const mapStateToProps = (state, { nodeType }) => {
  const variablesForNodeType = omitBy(
    getVariablesForNodeType(state, nodeType),
    variableMeta => !validTypes.includes(variableMeta.type),
  );

  return ({
    variablesForNodeType,
  });
};

/**
 * Requires prop.nodeType, prop.input (redux-forms)
 */

const withVaribleActions = compose(
  defaultProps({
    input: {
      value: {},
    },
  }),
  connect(mapStateToProps),
  withHandlers({
    createVariable: ({ input: { value, onChange }, variablesForNodeType }) =>
      (variable) => {
        // don't add existing property
        if (Object.prototype.hasOwnProperty.call(value, variable)) { return; }
        onChange({
          ...value,
          [variable]: getVariableDefault(variablesForNodeType[variable]),
        });
      },
    deleteVariable: ({ input: { onChange, value } }) => variable =>
      onChange(omit(value, variable)),
    updateVariable: ({ input: { onChange, value } }) => variable =>
      onChange({ ...value, ...variable }),
  }),
);

export default withVaribleActions;
