import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import { compose, defaultProps, withState, withHandlers } from 'recompose';
import StageEditor from './StageEditor';

const mapStateToProps = (state, props) => {
  const issues = getFormSyncErrors(props.form)(state);

  return {
    initialValues: props.stage,
    issues,
  };
};

export default compose(
  defaultProps({
    form: 'edit-stage',
  }),
  connect(mapStateToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
  }),
  reduxForm({
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
)(StageEditor);
