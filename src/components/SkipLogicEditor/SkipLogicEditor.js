import { compose, withProps } from 'recompose';
import Editor from '../Editor';
import SkipLogicFields from './SkipLogicFields';

export const formName = 'skip-logic';

const SkipLogicEditor = compose(
  withProps(() => ({
    form: formName,
    component: SkipLogicFields,
  })),
)(Editor);

export default SkipLogicEditor;
