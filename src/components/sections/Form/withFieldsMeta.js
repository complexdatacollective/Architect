import { connect } from 'react-redux';
import { reduce } from 'lodash';
import { formValueSelector } from 'redux-form';
import { getVariablesForSubject } from '../../../selectors/codebook';
import { getTypeForComponent } from '../../Form/inputOptions';

const mapStateToProps = (state, { form, entity, type }) => {
  const formSelector = formValueSelector(form);
  const component = formSelector(state, 'component');

  const existingVariables = getVariablesForSubject(state, { entity, type });

  const variableOptions = reduce(
    existingVariables,
    (acc, { name }, variableId) => {
      return [
        ...acc,
        { label: name, value: variableId },
      ];
    },
    [],
  );

  console.log({ variableOptions });

  const variableType = getTypeForComponent(component);

  return {
    variableType,
    variableOptions,
  };
};

const withFieldsMeta = connect(mapStateToProps);

export { withFieldsMeta };

export default withFieldsMeta;

