import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { getValidationOptionsForVariableType } from './options';

const mapStateToProps = (state, {
  form, name, variableType, entity,
}) => {
  const validationOptions = getValidationOptionsForVariableType(variableType, entity);
  return {
    validationOptions,
    value: formValueSelector(form)(state, name),
  };
};

const mapDispatchToProps = (dispatch, { form, name }) => ({
  update: (value) => dispatch(change(form, name, value)),
});

export default connect(mapStateToProps, mapDispatchToProps);
