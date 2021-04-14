import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, change } from 'redux-form';
import { actionCreators as dialogsActions } from '../../ducks/modules/dialogs';
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
  openDialog: bindActionCreators(dialogsActions.openDialog, dispatch),
  update: (value) => dispatch(change(form, name, value)),
});

export default connect(mapStateToProps, mapDispatchToProps);
