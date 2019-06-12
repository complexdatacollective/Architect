import { compose, withProps } from 'recompose';
import SkipLogicEditor, { formName } from '../SkipLogicEditor';
import EditorScreen from '../Screen/EditorScreen';

const skipLogicEditorProps = withProps({
  editor: SkipLogicEditor,
  form: formName,
});

const SkipLogicEditorScreen = compose(
  skipLogicEditorProps,
)(EditorScreen);

export default SkipLogicEditorScreen;
