import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { getVariableOptionsForNodeType } from '../../selectors/codebook';

const mapStateToProps = (state, { nodeType, form, fields }) => {
  const usedVariables = (formValueSelector(form)(state, fields.name) || [])
    .map(({ variable }) => variable);
  const variableOptions = getVariableOptionsForNodeType(state, nodeType);

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

const withVariableOptions = connect(mapStateToProps);

export default withVariableOptions;
