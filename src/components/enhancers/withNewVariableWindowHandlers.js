import PropTypes from 'prop-types';
import { withState, withHandlers, withProps, compose } from 'recompose';

const newVariableNameState = withState(
  'newVariableName', 'setNewVariableName', null,
);

const newVariableHandlers = withHandlers({
  openNewVariableWindow: ({ setNewVariableName }) =>
    variableName => setNewVariableName(variableName),
  closeNewVariableWindow: ({ setNewVariableName }) =>
    () => setNewVariableName(null),
});

const showVariableWindow = withProps(
  ({ newVariableName }) => ({
    showNewVariableWindow: newVariableName !== null,
  }),
);

const withVariableHandlers = compose(
  newVariableNameState,
  newVariableHandlers,
  showVariableWindow,
);

export const propTypes = {
  openNewVariableWindow: PropTypes.func.isRequired,
  closeNewVariableWindow: PropTypes.func.isRequired,
  newVariableName: PropTypes.string,
  showNewVariableWindow: PropTypes.bool.isRequired,
};

export default withVariableHandlers;
