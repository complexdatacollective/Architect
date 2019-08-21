import { connect } from 'react-redux';
import { change, formValueSelector } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';
import { getOptionsForVariable } from './helpers'; // move to codebook?
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const mapStateToProps = (state, { form, type, entity }) => {
  const variableOptions = getVariableOptionsForSubject(state, { type, entity });
  const variable = formValueSelector(form)(state, 'variable');
  const optionsForVariable = getOptionsForVariable(state, { type, entity, variable });

  return {
    variable,
    variableOptions,
    optionsForVariable,
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
      // update form
      changeForm(form, 'variable', variable);
      changeForm(form, 'variableOptions', []);
      closeNewVariableWindow();
    },
  handleDeleteVariable: ({ entity, type, deleteVariable }) =>
    variable => deleteVariable(entity, type, variable),
  handleUpdateVariable: ({ changeForm, form, optionsForVariable }) =>
    () => {
      changeForm(form, 'variableOptions', optionsForVariable);
    },
});

const withPromptProps = compose(
  variableOptions,
  variableHandlers,
);

export default withPromptProps;
