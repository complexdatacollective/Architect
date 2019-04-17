import PropTypes from 'prop-types';
import { withState, withHandlers, withProps, compose } from 'recompose';

/**
 * Helper props for use with <NewVariableWindow />
 *
 * openNewVariableWindow,
 * closeNewVariableWindow,
 * newVariableName,
 * showNewVariableWindow,
 *
 * TODO: Should these live with NewVariableWindow?
 */

const parseVariableName = variableName =>
  (typeof variableName === 'string' ? variableName : '');

const newVariableNameState = withState(
  'newVariableName', 'setNewVariableName', null,
);

const newVariableHandlers = withHandlers({
  openNewVariableWindow: ({ setNewVariableName }) =>
    variableName => setNewVariableName(parseVariableName(variableName)),
  closeNewVariableWindow: ({ setNewVariableName }) =>
    () => setNewVariableName(null),
});

const showVariableWindow = withProps(
  ({ newVariableName }) => ({
    showNewVariableWindow: newVariableName !== null,
  }),
);

const withNewVariableWindowHandlers = compose(
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

export default withNewVariableWindowHandlers;
