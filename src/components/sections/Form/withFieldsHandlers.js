import { connect } from 'react-redux';
import { reduce, get, pickBy } from 'lodash';
import { formValueSelector, change } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { getVariablesForSubject } from '../../../selectors/codebook';
import { getTypeForComponent } from '../../Form/inputOptions';
import { actionCreators as codebookActions } from '../../../ducks/modules/protocol/codebook';

const mapStateToProps = (state, { form, entity, type }) => {
  const formSelector = formValueSelector(form);
  const variable = formSelector(state, 'variable');
  const component = formSelector(state, 'component');

  const existingVariables = getVariablesForSubject(state, { entity, type });

  const variablesWithComponents = pickBy(existingVariables, value => value.component);

  const variableOptions = reduce(
    variablesWithComponents,
    (acc, { name }, variableId) => ([
      ...acc,
      { label: name, value: variableId },
    ]),
    [],
  );

  const variableType = getTypeForComponent(component);

  return {
    variable,
    variableType,
    variableOptions,
    variablesWithComponents,
  };
};

const mapDispatchToProps = {
  createVariable: codebookActions.createVariable,
  changeField: change,
};

const fieldsState = connect(mapStateToProps, mapDispatchToProps);

const fieldsHandlers = withHandlers({
  handleChangeComponent: ({ changeField, form }) =>
    () => {
      changeField(form, 'options', null);
      changeField(form, 'validation', {});
    },
  createNewVariable: ({ createVariable, entity, type }) =>
    (name) => {
      const { variable } = createVariable(entity, type, { name });
      return variable;
    },
  handleChangeVariable: ({ variablesWithComponents, changeField, form }) =>
    (_, value) => {
      // Either load settings from codebook, or reset
      const options = get(variablesWithComponents, [value, 'options'], null);
      const validation = get(variablesWithComponents, [value, 'validation'], {});
      const component = get(variablesWithComponents, [value, 'component'], null);

      // component?
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
  fieldsState,
  fieldsHandlers,
);

