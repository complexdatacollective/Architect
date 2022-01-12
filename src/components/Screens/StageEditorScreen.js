import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, withProps, withHandlers } from 'recompose';
import {
  isInvalid as isFormInvalid,
} from 'redux-form';
import { Button } from '@codaco/ui';
import { actionCreators as previewActions } from '../../ducks/modules/preview';
import EditorScreen from '../Screen/EditorScreen';
import StageEditor, { formName } from '../StageEditor';
import withTooltip from '../enhancers/withTooltip';

const mapStateToProps = (state) => ({
  invalid: isFormInvalid(formName)(state),
});

const mapDispatchToProps = (dispatch, props) => {
  const stageMeta = {
    id: props.id,
    insertAtIndex: props.insertAtIndex,
  };

  return {
    closePreview: bindActionCreators(previewActions.closePreview, dispatch),
    previewStage: () => dispatch(previewActions.previewStageFromForm(stageMeta, formName)),
  };
};

const stageEditorState = connect(mapStateToProps, mapDispatchToProps);

const stageEditorHanders = withHandlers({
  handlePreview: ({ previewStage }) => () => previewStage(),
  onComplete: ({ onComplete, closePreview }) => (...args) => {
    closePreview();
    onComplete(...args);
  },
});

const invalidStageMessage = (invalid) => (invalid ? ['Previewing this stage requires valid stage configuration. Fix the errors on this stage to enable previewing.'] : []);

const TooltipButton = withTooltip(Button);

const stageEditorProps = withProps(({
  handlePreview,
  invalid,
}) => ({
  editor: StageEditor,
  form: formName,
  secondaryButtons: [
    <TooltipButton
      key="preview"
      onClick={handlePreview}
      color="paradise-pink"
      disabled={invalid}
      tooltip={invalid ? invalidStageMessage(invalid) : null}
    >
      Preview
    </TooltipButton>,
  ],
}));

const StageEditorScreen = compose(
  stageEditorState,
  stageEditorHanders,
  stageEditorProps,
)(EditorScreen);

export default StageEditorScreen;
