import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getVariableOptionsForSubject } from '../../selectors/codebook';

const ALLOWED_TYPES = [
  'text',
  'number',
  'boolean',
  'ordinal',
  'categorical',
];

const mapStateToProps = (state, { entity, type, form, fields }) => {
  const usedVariables = (formValueSelector(form)(state, fields.name) || [])
    .map(({ variable }) => variable);
  const variableOptions = getVariableOptionsForSubject(state, { entity, type });

  const variableOptionsWithUsedDisabled = variableOptions
    .filter(({ type: optionType }) => ALLOWED_TYPES.includes(optionType))
    .map(({ value, ...rest }) => ({
      ...rest,
      value,
      isDisabled: usedVariables.includes(value),
    }));

  return {
    variableOptions: variableOptionsWithUsedDisabled,
  };
};

const withVariableOptions = connect(mapStateToProps);

export default withVariableOptions;
