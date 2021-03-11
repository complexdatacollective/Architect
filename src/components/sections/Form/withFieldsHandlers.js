import { connect } from 'react-redux';
import { find, get, has } from 'lodash';
import { formValueSelector, change } from 'redux-form';
import {
  compose,
  withHandlers,
} from 'recompose';
import INPUT_OPTIONS, {
  getTypeForComponent,
  getComponentsForType,
  VARIABLE_TYPES_WITH_COMPONENTS,
} from '@app/config/variables';
import { actionCreators as codebookActions } from '@modules/protocol/codebook';
import { getVariablesForSubject, getVariableOptionsForSubject } from '@selectors/codebook';

const mapStateToProps = (state, { form, entity, type }) => {
  const formSelector = formValueSelector(form);
  const variable = formSelector(state, 'variable');
  const component = formSelector(state, 'component');
  const createNewVariable = formSelector(state, '_createNewVariable');
  const isNewVariable = !!createNewVariable;

  const existingVariables = getVariablesForSubject(state, { entity, type });
  const variableOptions = getVariableOptionsForSubject(state, { entity, type })
    // If not a variable with corresponding component, we can't use it here.
    .filter(({ type: variableType }) => VARIABLE_TYPES_WITH_COMPONENTS.includes(variableType))
    // with Nev variable
    .concat(isNewVariable ? [{ label: createNewVariable, value: createNewVariable }] : []);

  // 1. If type defined use that (existing variable)
  // 2. Othewise derive it from component (new variable)
  const variableType = get(
    existingVariables,
    [variable, 'type'],
    getTypeForComponent(component),
  );

  // 1. If type defined, show components that match (existing variable)
  // 2. Otherwise list all INPUT_OPTIONS (new variable)
  const componentOptions = variableType && !isNewVariable
    ? getComponentsForType(variableType)
    : INPUT_OPTIONS;

  const metaForType = find(componentOptions, { value: component });

  return {
    variable,
    variableType,
    variableOptions,
    componentOptions,
    component,
    metaForType,
    existingVariables,
    isNewVariable,
  };
};

const mapDispatchToProps = {
  changeField: change,
  deleteVariable: codebookActions.deleteVariable,
};

const fieldsState = connect(mapStateToProps, mapDispatchToProps);

const fieldsHandlers = withHandlers({
  handleChangeComponent: ({ changeField, form, variableType }) => (e, value) => {
    // Only reset if type not defined yet (new variable)
    const typeForComponent = getTypeForComponent(value);

    if (variableType !== typeForComponent) {
      changeField(form, 'options', null);
      changeField(form, 'validation', {});
    }

    // Always reset this, since it is at least partly related
    // to the component
    changeField(form, 'parameters', null);
  },
  handleChangeVariable: ({ existingVariables, changeField, form }) => (_, value) => {
    // Either load settings from codebook, or reset
    const options = get(existingVariables, [value, 'options'], null);
    const parameters = get(existingVariables, [value, 'parameters'], null);
    const validation = get(existingVariables, [value, 'validation'], {});
    const component = get(existingVariables, [value, 'component'], null);

    // If value was set to something from codebook, reset this flag
    if (has(existingVariables, value)) {
      changeField(form, '_createNewVariable', null);
    }
    changeField(form, 'component', component);
    changeField(form, 'options', options);
    changeField(form, 'parameters', parameters);
    changeField(form, 'validation', validation);
  },
  handleDeleteVariable: ({
    entity,
    type,
    deleteVariable,
  }) => (variable) => {
    deleteVariable(entity, type, variable);
  },
  handleNewVariable: ({ changeField, form }) => (value) => {
    changeField(form, '_createNewVariable', value);
    changeField(form, 'variable', value);
    return value;
  },
});

export {
  fieldsState,
  fieldsHandlers,
};

export default compose(
  fieldsState,
  fieldsHandlers,
);
