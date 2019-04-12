import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getVariableOptionsForSubject } from '../../selectors/codebook';

const mapStateToProps = (state, { entity, type, form, fields }) => {
  const usedVariables = (formValueSelector(form)(state, fields.name) || [])
    .map(({ variable }) => variable);
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });

  const variableOptionsWithUsedDisabled = variableOptions
    .map(({ value, ...rest }) => ({
      ...rest,
      value,
      isDisabled: usedVariables.includes(value),
    }));

  return {
    variableOptions: variableOptionsWithUsedDisabled,
  };
};

const withAssignAttributesOptions = connect(mapStateToProps);

export default withAssignAttributesOptions;
