import { connect } from 'react-redux';
import { change } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { getVariableOptionsForSubject } from '../../../selectors/codebook';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const mapStateToProps = (state, { type, entity }) => {
  const variableOptions = getVariableOptionsForSubject(state, { type, entity });

  return {
    variableOptions,
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
      closeNewVariableWindow();
    },

  handleDeleteVariable: ({ entity, type, deleteVariable }) =>
    variable => deleteVariable(entity, type, variable),
});

const withPromptProps = compose(
  variableOptions,
  variableHandlers,
);

export default withPromptProps;
