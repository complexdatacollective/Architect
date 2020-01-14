import { connect } from 'react-redux';
import { change } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { camelCase, startCase } from 'lodash';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';

const mapDispatchToProps = {
  changeForm: change,
  deleteVariable: codebookActions.deleteVariable,
};

const variableHandlerState = connect(null, mapDispatchToProps);

const variableHandlers = (variableName = '') => {
  const casedVariableName = startCase(variableName);

  return withHandlers({
    [camelCase(`Handle Create New Variable For ${casedVariableName}`)]: ({ closeNewVariableWindow, changeForm, form }) =>
      (variable) => {
        changeForm(form, variableName, variable);
        closeNewVariableWindow();
      },
    [camelCase(`Handle Delete Variable For ${casedVariableName}`)]: ({
      entity,
      type,
      deleteVariable,
      changeForm,
      form,
      variable: selectedVariable,
    }) =>
      (variable) => {
        const variableDeleted = deleteVariable(entity, type, variable);
        if (variableDeleted && variable === selectedVariable) {
          changeForm(form, variableName, null);
        }
      },
  });
};

const withNewVariableHandlers = variableName =>
  compose(
    variableHandlerState,
    variableHandlers(variableName),
  );

export default withNewVariableHandlers;
