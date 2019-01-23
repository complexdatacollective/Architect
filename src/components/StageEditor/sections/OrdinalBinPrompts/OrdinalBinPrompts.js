import React from 'react';
import Prompts from '../../../Prompts';
import PromptPreview from './PromptPreview';
import PromptForm from './PromptForm';

const OrdinalBinPrompts = props => (
  <Prompts
    contentId="guidance.editor.ordinal_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptForm}
    template={{ color: 'ord-color-seq-1' }}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to enable your participants to organise nodes.
    </p>
  </Prompts>
);

export { OrdinalBinPrompts };

export default OrdinalBinPrompts;
