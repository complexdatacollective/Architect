import { compose, withProps } from 'recompose';
import TypeEditor, { formName } from '../TypeEditor';
import EditorScreen from '../Screen/EditorScreen';

const typeEditorProps = withProps({
  editor: TypeEditor,
  form: formName,
});

const FormEditorScreen = compose(
  typeEditorProps,
)(EditorScreen);

export default FormEditorScreen;
