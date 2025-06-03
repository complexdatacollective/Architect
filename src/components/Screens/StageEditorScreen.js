import React from 'react';
import { compose, withProps } from 'recompose';
import EditorScreen from '../Screen/EditorScreen';
import StageEditor, { formName } from '../StageEditor';

const stageEditorProps = withProps(() => ({
  editor: StageEditor,
  form: formName,
  secondaryButtons: [
    // Preview functionality removed during migration
  ],
}));

const StageEditorScreen = compose(
  stageEditorProps,
)(EditorScreen);

export default StageEditorScreen;
