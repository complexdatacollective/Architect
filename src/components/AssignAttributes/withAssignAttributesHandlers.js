import { compose, withProps, withStateHandlers, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { getVariables, asOption } from '@selectors/codebook';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

const ALLOWED_TYPES = [
  'text',
  'number',
  'boolean',
  'ordinal',
  'categorical',
];

// TODO: ensure works as before
const mapStateToProps = (state, { entity, type }) => {
  const variables = getVariables(state, { includeDraft: true })
    .filter(({ subject, type: variableType }) => {
      const matchingSubject = isEqual(subject === { entity, type })
      const allowedType = ALLOWED_TYPES.includes(variableType);
      return matchingSubject && allowedType;
    });

  const variableOptions = variables.map(asOption())
    .map(({ inUse, ...rest }) => ({ isDisabled: inUse, ...rest }));

  return {
    variableOptions,
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
