import { compose, withProps } from 'recompose';
import EditScreen from './EditScreen';
import VariableEditor, { formName } from '../VariableEditor';

const VariableEditorScreen = compose(
  withProps(() => ({
    editor: VariableEditor,
    form: formName,
  })),
)(EditScreen);

export default VariableEditorScreen;
