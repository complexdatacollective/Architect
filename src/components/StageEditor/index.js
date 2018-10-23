import { connect } from 'react-redux';
import {
  reduxForm,
  getFormSyncErrors,
} from 'redux-form';
import { compose, withState, withHandlers } from 'recompose';
import StageEditor from './StageEditor';

const formName = 'edit-stage';

const mapStateToProps = (state, props) => {
  const issues = getFormSyncErrors(formName)(state);
  return {
    initialValues: props.stage,
    issues,
  };
};

export default compose(
  connect(mapStateToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
    handleShowPreview: () => {},
  }),
  reduxForm({
    form: formName,
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
)(StageEditor);
