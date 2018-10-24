import { connect } from 'react-redux';
import { reduxForm, getFormSyncErrors } from 'redux-form';
import { compose, withState, withHandlers } from 'recompose';
import { actionCreators as previewActions } from '../../ducks/modules/preview';
import StageEditor from './StageEditor';

const formName = 'edit-stage';

const mapStateToProps = (state, props) => {
  const issues = getFormSyncErrors(formName)(state);

  return {
    initialValues: props.stage,
    issues,
  };
};

const mapDispatchToProps = dispatch => ({
  previewStage: () => dispatch(previewActions.previewStageByFormName(formName)),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
    handleShowPreview: ({ previewStage }) => () => previewStage(),
  }),
  reduxForm({
    form: formName,
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
)(StageEditor);
