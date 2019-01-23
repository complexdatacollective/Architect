import React from 'react';
import { withProps, compose } from 'recompose';
import Prompts, { withSubjectNodeType } from '../../../Prompts';
import PromptPreview from './PromptPreview';
import PromptForm from './PromptForm';

const CategoricalBinPrompts = props => (
  <Prompts
    contentId="guidance.editor.categorical_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptForm}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to enable your participants to organise nodes.
    </p>
  </Prompts>
);

export { CategoricalBinPrompts };

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(CategoricalBinPrompts);
