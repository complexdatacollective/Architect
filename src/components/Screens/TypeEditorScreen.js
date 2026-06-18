import { compose, withProps } from 'recompose';

import EditorScreen from '../Screen/EditorScreen';
import TypeEditor, { formName } from '../TypeEditor';

const typeEditorProps = withProps({
  editor: TypeEditor,
  form: formName,
});

const FormEditorScreen = compose(typeEditorProps)(EditorScreen);

export default FormEditorScreen;
