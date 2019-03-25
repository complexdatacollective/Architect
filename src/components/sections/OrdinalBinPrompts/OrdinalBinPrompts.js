import React from 'react';
import { withProps, compose } from 'recompose';
import EditableList, { withSubjectNodeType } from '../../EditableList';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const template = () => ({ color: 'ord-color-seq-1' });

const OrdinalBinPrompts = props => (
  <EditableList
    contentId="guidance.editor.ordinal_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    template={template}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to enable your participants to organise nodes.
    </p>
  </EditableList>
);

export { OrdinalBinPrompts };

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(OrdinalBinPrompts);
