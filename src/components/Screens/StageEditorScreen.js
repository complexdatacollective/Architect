import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps, withHandlers } from 'recompose';
import {
  isInvalid as isFormInvalid,
} from 'redux-form';
import { Button } from '../../ui/components';
import { actionCreators as previewActions } from '../../ducks/modules/preview';
import EditScreen from './EditScreen';
import StageEditor, { formName } from '../StageEditor';

const mapStateToProps = state => ({
  invalid: isFormInvalid(formName)(state),
});

const mapDispatchToProps = (dispatch, props) => {
  const stageMeta = {
    id: props.id,
  };

  return {
    closePreview: bindActionCreators(previewActions.closePreview, dispatch),
    previewStage: () => dispatch(previewActions.previewStageByFormName(stageMeta, formName)),
  };
};

const stageEditorState = connect(mapStateToProps, mapDispatchToProps);

const stageEditorHanders = withHandlers({
  handlePreview: ({ previewStage }) =>
    () => previewStage(),
});

const stageEditorProps = withProps(({
  handlePreview,
  invalid,
}) => ({
  editor: StageEditor,
  form: formName,
  secondaryButtons: [
    <Button
      key="preview"
      onClick={handlePreview}
      color="paradise-pink"
      disabled={invalid}
    >Preview</Button>,
  ],
}));

const StageEditorScreen = compose(
  stageEditorState,
  stageEditorHanders,
  stageEditorProps,
)(EditScreen);

export default StageEditorScreen;
