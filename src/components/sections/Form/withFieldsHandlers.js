import { connect } from 'react-redux';
import { reduce, get } from 'lodash';
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

  const variableOptions = reduce(
    existingVariables,
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
    existingVariables,
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
  handleChangeVariable: ({ existingVariables, changeField, form }) =>
    (_, value) => {
      // Either load settings from codebook, or reset
      const options = get(existingVariables, [value, 'options'], null);
      const validation = get(existingVariables, [value, 'validation'], {});
      const component = get(existingVariables, [value, 'component'], null);

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

