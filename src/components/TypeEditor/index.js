import { connect } from 'react-redux';
import { reduxForm, isDirty, isValid, formValueSelector } from 'redux-form';
import { compose, withState, withHandlers } from 'recompose';
import { compact, map } from 'lodash';
import TypeEditor from './TypeEditor';

const formName = 'VARIABLE_REGISTRY';

const getFormValue = formValueSelector(formName);
const getIsDirty = isDirty(formName);
const getIsValid = isValid(formName);

const mapStateToProps = (state) => {
  const variables = getFormValue(state, 'variables') || {};
  const displayVariables = compact(map(variables, 'name'));

  return {
    dirty: getIsDirty(state),
    valid: getIsValid(state),
    displayVariables,
  };
};

export { formName };
export { parse, format } from './convert';

export default compose(
  connect(mapStateToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
  }),
  reduxForm({
    form: formName,
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
)(TypeEditor);
