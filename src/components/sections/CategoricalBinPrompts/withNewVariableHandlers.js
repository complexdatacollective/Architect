import { change } from 'redux-form';
import { connect } from 'react-redux';
import { withState, withHandlers, compose } from 'recompose';

const withFormState = connect(
  null,
  { changeForm: change },
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
});

const withNewVariableHandlers = compose(
  withFormState,
  createNewVariableState,
  newVariableHandlers,
);

export default withNewVariableHandlers;
