import { compose, withProps } from 'recompose';
import FormEditor, { formName } from '../FormEditor';
import EditScreen from './EditScreen';

const formEditorProps = withProps({
  editor: FormEditor,
  form: formName,
});

const FormEditorScreen = compose(
  formEditorProps,
)(EditScreen);

export default FormEditorScreen;
