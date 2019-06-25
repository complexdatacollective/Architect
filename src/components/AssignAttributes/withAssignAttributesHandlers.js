import { compose, withProps, withStateHandlers, withHandlers } from 'recompose';
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
const assignAttributesStateHandlers = withStateHandlers(
  {
    createNewVariableAtIndex: null,
    newVariables: [],
  },
  {
    addNewVariable: ({ newVariables }) =>
      variable => ({
        newVariables: [...newVariables, variable],
      }),
    removeNewVariable: ({ newVariables }) =>
      variable => ({
        newVariables: newVariables
          .filter(id => id !== variable),
      }),
    handleOpenCreateNew: () =>
      createNewVariableAtIndex => ({ createNewVariableAtIndex }),
    handleCompleteCreateNewVariable: () =>
      () => ({ createNewVariableAtIndex: null }),
  },
);

const assignAttributesHandlers = withHandlers({
  handleDelete: ({
    fields, entity, type, deleteVariable, newVariables, removeNewVariable,
  }) =>
    (index) => {
      const field = fields.get(index);
      fields.remove(index);
      if (field.variable && newVariables.includes(field.variable)) {
        deleteVariable(entity, type, field.variable);
        removeNewVariable(field.variable);
      }
      return undefined;
    },
  handleCreateNewVariable: ({
    handleCompleteCreateNewVariable, createNewVariableAtIndex, fields, addNewVariable,
  }) =>
    (variable) => {
      const newAttribute = { variable, value: null };
      fields.splice(createNewVariableAtIndex, 1, newAttribute);
      handleCompleteCreateNewVariable();
      addNewVariable(variable);
    },
  handleAddNew: ({ fields }) =>
    () => fields.push({}),
});

const showNewVariableWindow = withProps(
  ({ createNewVariableAtIndex }) => ({
    showNewVariableWindow: createNewVariableAtIndex !== null,
  }),
);

const withNewVariableHandlers = compose(
  connect(mapStateToProps, mapDispatchToProps),
  assignAttributesStateHandlers,
  assignAttributesHandlers,
  showNewVariableWindow,
);

export default withNewVariableHandlers;
