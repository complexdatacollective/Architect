import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';
import { change } from 'redux-form';
import { isEmpty } from 'lodash';
import { actionCreators as codebookActions } from '../../ducks/modules/protocol/codebook';
import safeName from '../../utils/safeName';

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  deleteVariable: codebookActions.deleteVariable,
  changeField: change,
};

export const normalizeKeyDown = (event) => {
  const check = safeName(event.key);

  if (isEmpty(check)) {
    event.preventDefault();
  }
};

const createVariableHandler = {
  handleCreateVariable: ({
    changeField, createVariable, type, entity, form,
  }) => async (variableName, variableType, field) => {
    const withType = variableType ? { type: variableType } : {};

    const configuration = {
      name: variableName,
      ...withType,
    };

    const { variable } = await createVariable(entity, type, configuration);

    // If we supplied a field, update it with the result of the variable creation
    if (field) {
      changeField(form, field, variable);
    }

    return variable;
  },
  handleDeleteVariable: (
    { deleteVariable, type, entity },
  ) => (variableId) => deleteVariable(entity, type, variableId),
  normalizeKeyDown: () => normalizeKeyDown,
};

/**
  * usage:
  * withCreateVariableHandler(MyComponent)
  *
  * MyComponent = (handleCreateVariable) => (
  *   <div handler={() => handleCreateVariable(value, type)} />
  * )
  */
const withCreateVariableHandler = compose(
  connect(null, mapDispatchToProps),
  withHandlers(createVariableHandler),
);

export default withCreateVariableHandler;
