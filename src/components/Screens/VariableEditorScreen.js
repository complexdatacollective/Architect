import { compose, withProps } from 'recompose';
import EditorScreen from '../Screen/EditorScreen';
import VariableEditor, { formName } from '../VariableEditor';

const VariableEditorScreen = compose(
  withProps(() => ({
    editor: VariableEditor,
    form: formName,
  })),
)(EditorScreen);

export default VariableEditorScreen;
