import PropTypes from 'prop-types';
import {
  withState, withHandlers, mapProps, compose,
} from 'recompose';
import { get } from 'lodash';
import { normalizeKeyDown } from './withCreateVariableHandler';

/**
 * Helper props for use with <NewVariableWindow />
 *
 * openNewVariableWindow,
 * closeNewVariableWindow,
 * newVariableName,
 * newVariableOptions, // intended to be used for initialState, but can be used for anything
 * showNewVariableWindow,
 *
 * TODO: Should these live with NewVariableWindow?
 */

const newVariableInitialState = {
  variableName: null,
  variableOptions: {},
};

const parseVariableName = (variableName) => (typeof variableName === 'string' ? variableName : '');

const newVariablePropertiesState = withState(
  'newVariableProperties', 'setNewVariableProperties', newVariableInitialState,
);

const newVariableHandlers = withHandlers({
  openNewVariableWindow: (
    { setNewVariableProperties },
  ) => (variableName, variableOptions = {}) => setNewVariableProperties({
    variableName: parseVariableName(variableName),
    variableOptions,
  }),
  closeNewVariableWindow: (
    { setNewVariableProperties },
  ) => () => setNewVariableProperties(newVariableInitialState),
  normalizeKeyDown: () => normalizeKeyDown,
});

const showVariableWindow = mapProps(
  ({ newVariableProperties, ...rest }) => ({
    showNewVariableWindow: newVariableProperties.variableName !== null,
    newVariableName: get(newVariableProperties, 'variableName', null),
    newVariableOptions: get(newVariableProperties, 'variableOptions', {}),
    ...rest,
  }),
);

const withNewVariableWindowHandlers = compose(
  newVariablePropertiesState,
  newVariableHandlers,
  showVariableWindow,
);

export const propTypes = {
  openNewVariableWindow: PropTypes.func.isRequired,
  closeNewVariableWindow: PropTypes.func.isRequired,
  newVariableName: PropTypes.string,
  showNewVariableWindow: PropTypes.bool.isRequired,
  normalizeKeyDown: PropTypes.func.isRequired,
};

export default withNewVariableWindowHandlers;
