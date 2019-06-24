import { compose, withState, withHandlers, withProps } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getVariableOptionsForSubject } from '../../selectors/codebook';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const ALLOWED_TYPES = [
  'text',
  'number',
  'boolean',
  'ordinal',
  'categorical',
];

const mapStateToProps = (state, { entity, type, form, fields }) => {
  const usedVariables = (formValueSelector(form)(state, fields.name) || [])
    .map(({ variable }) => variable);
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });

  const variableOptionsWithUsedDisabled = variableOptions
    .filter(({ type: optionType }) => ALLOWED_TYPES.includes(optionType))
    .map(({ value, ...rest }) => ({
      ...rest,
      value,
      isDisabled: usedVariables.includes(value),
    }));

  return {
    variableOptions: variableOptionsWithUsedDisabled,
  };
};

const mapDispatchToProps = {
  deleteVariable: codebookActions.deleteVariable,
};

const createNewVariableWindowState = withState(
  'createNewVariableAtIndex', 'setCreateNewVariableAtIndex', null,
);

const newVariablesState = withState(
  'newVariables', 'setNewVariables', [],
);

const createNewVariableHandlers = withHandlers({
  handleDelete: ({ fields, entity, type, deleteVariable, newVariables }) =>
    (index, variable) => {
      fields.remove(index);
      if (variable && newVariables.includes(variable)) {
        deleteVariable(entity, type, variable);
      }
    },
  handleCreateNewVariable: ({
    setCreateNewVariableAtIndex,
    createNewVariableAtIndex,
    fields,
    newVariables,
    setNewVariables,
  }) =>
    (variable) => {
      const newAttribute = { variable, value: null };
      fields.splice(createNewVariableAtIndex, 1, newAttribute);
      setCreateNewVariableAtIndex(null);
      setNewVariables([...newVariables, variable]);
    },
  handleCreateNew: ({ setCreateNewVariableAtIndex }) =>
    index => setCreateNewVariableAtIndex(index),
  handleCancelCreateNewVariable: ({ setCreateNewVariableAtIndex }) =>
    () => setCreateNewVariableAtIndex(null),
});

const showNewVariableWindow = withProps(
  ({ createNewVariableAtIndex }) => ({
    showNewVariableWindow: createNewVariableAtIndex !== null,
  }),
);

const withNewVariableHandlers = compose(
  createNewVariableWindowState,
  newVariablesState,
  connect(mapStateToProps, mapDispatchToProps),
  createNewVariableHandlers,
  showNewVariableWindow,
);

export default withNewVariableHandlers;
