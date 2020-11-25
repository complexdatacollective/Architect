import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getVariableOptionsForSubject } from '../../selectors/codebook';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';

const ALLOWED_TYPES = [
  'boolean',
];

// TODO: isUsed
const mapStateToProps = (state, { entity, type, form, fields }) => {
  const usedVariables = (formValueSelector(form)(state, fields.name) || [])
    .map(({ variable }) => variable);
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });

  const variableOptionsWithUsedDisabled = variableOptions
    .filter(({ type: optionType }) => ALLOWED_TYPES.includes(optionType))
    .map(({ value, ...rest }) => ({
      ...rest,
      value,
      disabled: usedVariables.includes(value),
    }));

  return {
    variableOptions: variableOptionsWithUsedDisabled,
    allowedVariableTypes: ALLOWED_TYPES,
  };
};

const mapDispatchToProps = {
  deleteVariable: codebookActions.deleteVariable,
};

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

const withNewVariableHandlers = compose(
  connect(mapStateToProps, mapDispatchToProps),
  assignAttributesHandlers,
);

export default withNewVariableHandlers;
