import { connect } from 'react-redux';
import { reduce, get } from 'lodash';
import { formValueSelector, change } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { getVariablesForSubject } from '../../../selectors/codebook';
import inputOptions, {
  getTypeForComponent,
  getComponentsForType,
  VARIABLE_TYPES_WITH_COMPONENTS,
} from '../../Form/inputOptions';
import withCreateVariableHandler from '../../enhancers/withCreateVariableHandler';

const mapStateToProps = (state, { form, entity, type }) => {
  const formSelector = formValueSelector(form);
  const variable = formSelector(state, 'variable');
  const component = formSelector(state, 'component');

  const existingVariables = getVariablesForSubject(state, { entity, type });

  const variableOptions = reduce(
    existingVariables,
    (acc, { name, type: variableType }, variableId) => {
      // If not a variable with corresponding component, we can't
      // use it here.
      if (variableType && !VARIABLE_TYPES_WITH_COMPONENTS.includes(variableType)) { return acc; }

      return [
        ...acc,
        { label: name, value: variableId },
      ];
    },
    [],
  );

  // 1. If type defined use that (existing variable)
  // 2. Othewise derive it from component (new variable)
  const variableType = get(
    existingVariables,
    [variable, 'type'],
    getTypeForComponent(component),
  );

  // 1. If type defined, show components that match (existing variable)
  // 2. Othewise list all inputOptions (new variable)
  const componentOptions = variableType ?
    getComponentsForType(variableType) :
    inputOptions;

  return {
    variable,
    variableType,
    variableOptions,
    componentOptions,
    existingVariables,
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
  handleChangeVariable: ({ existingVariables, changeField, form }) =>
    (_, value) => {
      // Either load settings from codebook, or reset
      const name = get(existingVariables, [value, 'name'], null);
      const options = get(existingVariables, [value, 'options'], null);
      const validation = get(existingVariables, [value, 'validation'], {});
      const component = get(existingVariables, [value, 'component'], null);

      // component?
      changeField(form, 'name', name);
      changeField(form, 'component', component);
      changeField(form, 'options', options);
      changeField(form, 'validation', validation);
    },
});

export {
  fieldsState,
  fieldsHandlers,
};

export default compose(
  withCreateVariableHandler,
  fieldsState,
  fieldsHandlers,
);

