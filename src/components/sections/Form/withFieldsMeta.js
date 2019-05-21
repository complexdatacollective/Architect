import { connect } from 'react-redux';
import { reduce } from 'lodash';
import { formValueSelector } from 'redux-form';
import { getVariablesForSubject } from '../../../selectors/codebook';
import { getTypeForComponent } from '../../Form/inputOptions';

const mapStateToProps = (state, { form, entity, type }) => {
  const formSelector = formValueSelector(form);
  const component = formSelector(state, 'component');
  const variable = formSelector(state, 'variable');

  const existingVariables = getVariablesForSubject(state, { entity, type });
  const existingVariableNames = reduce(
    existingVariables,
    (acc, { name }, variableId) => {
      if (variable === variableId) { return acc; }
      return [...acc, name];
    },
    [],
  );

  const variableType = getTypeForComponent(component);

  return {
    variableType,
    existingVariableNames,
  };
};

const withFieldsMeta = connect(mapStateToProps);

export { withFieldsMeta };

export default withFieldsMeta;

