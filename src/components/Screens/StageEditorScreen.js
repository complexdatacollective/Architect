// import React from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import {
  compose,
  // withProps,
  // withHandlers,
} from 'recompose';
// import {
//   isInvalid as isFormInvalid,
// } from 'redux-form';
// import { Button } from '@codaco/ui';
// import { actionCreators as previewActions } from '../../ducks/modules/preview';
// import EditorScreen from '../Screen/EditorScreen';
import StageEditor from '@components/StageEditor2';

// const mapStateToProps = state => ({
//   invalid: isFormInvalid(formName)(state),
// });

// const mapDispatchToProps = (dispatch, props) => {
//   const stageMeta = {
//     id: props.id,
//     insertAtIndex: props.insertAtIndex,
//   };

//   return {
//     closePreview: bindActionCreators(previewActions.closePreview, dispatch),
//     previewStage: () => dispatch(previewActions.previewStageFromForm(stageMeta, formName)),
//   };
// };

// const stageEditorState = connect(mapStateToProps, mapDispatchToProps);

// const stageEditorHanders = withHandlers({
//   handlePreview: ({ previewStage }) =>
//     () => previewStage(),
//   onComplete: ({ onComplete, closePreview }) =>
//     (...args) => {
//       closePreview();
//       onComplete(...args);
//     },
// });

// const stageEditorProps = withProps(({
//   handlePreview,
//   invalid,
// }) => ({
//   editor: StageEditor,
//   secondaryButtons: [
//     <Button
//       key="preview"
//       onClick={handlePreview}
//       color="paradise-pink"
//       disabled={invalid}
//       title={invalid ? 'Preview not available: stage configuration is invalid' : ''}
//     >Preview</Button>,
//   ],
// }));

const StageEditorScreen = compose(
  // stageEditorState,
  // stageEditorHanders,
  // stageEditorProps,
)(StageEditor);

export default StageEditorScreen;
