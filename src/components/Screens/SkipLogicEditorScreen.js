import { compose, withProps } from 'recompose';
import SkipLogicEditor, { formName } from '../SkipLogicEditor';
import EditScreen from './EditScreen';

const skipLogicEditorProps = withProps({
  editor: SkipLogicEditor,
  form: formName,
});

const SkipLogicEditorScreen = compose(
  skipLogicEditorProps,
)(EditScreen);

export default SkipLogicEditorScreen;
