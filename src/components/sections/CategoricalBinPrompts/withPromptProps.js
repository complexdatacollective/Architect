import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { get } from 'lodash';
import { getVariableOptionsForSubject, getVariablesForSubject } from '../../../selectors/codebook';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const mapStateToProps = (state, { form, type, entity }) => {
  const variableOptions = getVariableOptionsForSubject(state, { type, entity });
  const variable = formValueSelector(form)(state, 'variable');
  const variables = getVariablesForSubject(state, { type, entity });

  return {
    variable,
    variableOptions,
    variables,
  };
};

const mapDispatchToProps = {
  changeForm: change,
  deleteVariable: codebookActions.deleteVariable,
};

const variableOptions = connect(mapStateToProps, mapDispatchToProps);

const variableHandlers = withHandlers({
  handleCreateNewVariable: ({ closeNewVariableWindow, changeForm, form }) =>
    (variable) => {
      changeForm(form, 'variable', variable);
      changeForm(form, 'variableOptions', []);
      closeNewVariableWindow();
    },
  handleDeleteVariable: ({ entity, type, deleteVariable, changeForm, form }) =>
    (variable) => {
      deleteVariable(entity, type, variable);
      changeForm(form, 'variableOptions', []);
    },
  handleUpdateVariable: ({ changeForm, form, variables }) =>
    (_, variable) => {
      const optionsForVariable = get(variables, [variable, 'options'], []);
      changeForm(form, 'variableOptions', optionsForVariable);
    },
});

const withPromptProps = compose(
  variableOptions,
  variableHandlers,
);

export default withPromptProps;
