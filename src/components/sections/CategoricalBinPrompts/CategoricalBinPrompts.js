import React from 'react';
import { withProps, compose } from 'recompose';
import EditableList, { withSubjectNodeType } from '../../EditableList';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const CategoricalBinPrompts = props => (
  <EditableList
    contentId="guidance.editor.categorical_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    {...props}
  >
    <h2>Edit Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to enable your participants to organise nodes.
    </p>
  </EditableList>
);

export { CategoricalBinPrompts };

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(CategoricalBinPrompts);
