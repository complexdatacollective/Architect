import { compose, withProps } from 'recompose';
import TypeEditor, { formName } from '../TypeEditor';
import EditScreen from './EditScreen';

const typeEditorProps = withProps({
  editor: TypeEditor,
  form: formName,
});

const FormEditorScreen = compose(
  typeEditorProps,
)(EditScreen);

export default FormEditorScreen;
