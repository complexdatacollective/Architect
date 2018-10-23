import { ipcRenderer } from 'electron';
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

  const stageIndex = state.protocol.present.stages.findIndex(({ id }) => id === props.stage.id);

  return {
    initialValues: props.stage,
    issues,
    activeProtocol: state.session.activeProtocol,
    stageIndex,
  };
};

export default compose(
  connect(mapStateToProps),
  withState('codeView', 'updateCodeView', false),
  withHandlers({
    toggleCodeView: ({ updateCodeView }) => () => updateCodeView(current => !current),
    handleShowPreview: ({ activeProtocol, stageIndex }) => { ipcRenderer.send('OPEN_PREVIEW', activeProtocol, stageIndex); },
  }),
  reduxForm({
    form: formName,
    touchOnBlur: false,
    touchOnChange: true,
    enableReinitialize: true,
  }),
)(StageEditor);
