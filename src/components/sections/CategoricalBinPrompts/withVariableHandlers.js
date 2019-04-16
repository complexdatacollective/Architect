import { change } from 'redux-form';
import { connect } from 'react-redux';
import { withState, withHandlers, compose } from 'recompose';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const withActions = connect(
  null,
  {
    changeForm: change,
    deleteVariable: codebookActions.deleteVariable,
  },
);

const createNewVariableState = withState(
  'createNewVariable', 'setCreateNewVariable', null,
);

const newVariableHandlers = withHandlers({
  openNewVariableWindow: ({ setCreateNewVariable }) =>
    variableName => setCreateNewVariable(variableName),
  handleCancelNewVariable: ({ setCreateNewVariable }) =>
    setCreateNewVariable(null),
  handleCreateNewVariable: ({ setCreateNewVariable, changeForm, form }) =>
    (variable) => {
      // update form
      changeForm(form, 'variable', variable);
      setCreateNewVariable(null);
    },

  handleDeleteVariable: ({ entity, type, deleteVariable }) =>
    variable => deleteVariable(entity, type, variable),
});

const withVariableHandlers = compose(
  withActions,
  createNewVariableState,
  newVariableHandlers,
);

export default withVariableHandlers;
