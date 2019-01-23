import React from 'react';
import { withProps, compose } from 'recompose';
import Prompts, { withSubjectNodeType } from '../../../Prompts';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const OrdinalBinPrompts = props => (
  <Prompts
    contentId="guidance.editor.ordinal_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
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

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(OrdinalBinPrompts);
