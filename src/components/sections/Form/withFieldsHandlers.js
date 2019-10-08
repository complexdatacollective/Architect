import { connect } from 'react-redux';
import { get } from 'lodash';
import { formValueSelector, change } from 'redux-form';
import {
  compose,
  withHandlers,
} from 'recompose';
import { getVariables, asOption } from '@selectors/codebook';
import inputOptions, {
  getTypeForComponent,
  getComponentsForType,
  VARIABLE_TYPES_WITH_COMPONENTS,
} from '@components/Form/inputOptions';

const mapStateToProps = (state, { form, entity, type }) => {
  const formSelector = formValueSelector(form);
  const variableId = formSelector(state, 'variable'); // id?
  const component = formSelector(state, 'component');
  const createNewVariable = formSelector(state, '_createNewVariable');
  const isNewVariable = !!createNewVariable;
  const variables = getVariables(state, { includeDraft: true, entity, type });

  // HIDE USED VARIABLES
  const variableOptions = variables
    .filter(v =>
      VARIABLE_TYPES_WITH_COMPONENTS.includes(v.properties.type))
    .map((item) => {
      const option = asOption()(item);

      return {
        ...option,
        __canDelete__: option.inUse,
      };
    })
    .concat(
      isNewVariable ?
        [{ label: createNewVariable, value: createNewVariable }] :
        [],
    );

  // 1. If type defined use that (existing variable)
  // 2. Othewise derive it from component (new variable)
  const variableType = get(
    variables.find(({ id }) => variableId === id),
    'type',
    getTypeForComponent(component),
  );

  // 1. If type defined, show components that match (existing variable)
  // 2. Othewise list all inputOptions (new variable)
  const componentOptions = variableType && !isNewVariable ?
    getComponentsForType(variableType) :
    inputOptions;

  return {
    variable: variableId,
    variables,
    variableType,
    variableOptions,
    componentOptions,
    isNewVariable,
  };
};

const mapDispatchToProps = {
  changeField: change,
};

const fieldsState = connect(mapStateToProps, mapDispatchToProps);

const fieldsHandlers = withHandlers({
  handleChangeComponent: ({ changeField, form, variableType }) =>
    (e, value) => {
      // Only reset if type not defined (new variable)
      const componentType = getTypeForComponent(value);
      if (variableType !== componentType) {
        changeField(form, 'options', null);
        changeField(form, 'validation', {});
      }
    },
  handleChangeVariable: ({ variables, changeField, form }) =>
    (_, value) => {
      // Either load settings from codebook, or reset
      const variable = variables.find(({ id }) => id === value);

      const options = get(variable, 'properties.options', null);
      const validation = get(variable, 'properties.validation', {});
      const component = get(variable, 'properties.component', null);

      // If value was set to something from codebook, reset this flag
      if (variable) {
        changeField(form, '_createNewVariable', null);
      }
      changeField(form, 'component', component);
      changeField(form, 'options', options);
      changeField(form, 'validation', validation);
    },
  handleNewVariable: ({ changeField, form }) =>
    (value) => {
      changeField(form, '_createNewVariable', value);
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

