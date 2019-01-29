import React from 'react';
import Prompts from '../../../Prompts';
import CategoricalBinPrompt from './CategoricalBinPrompt';

const CategoricalBinPrompts = props => (
  <Prompts
    contentId="guidance.editor.categorical_bin_prompts"
    promptComponent={CategoricalBinPrompt}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to enable your participants to organise nodes.
    </p>
  </Prompts>
);

export { CategoricalBinPrompts };

export default CategoricalBinPrompts;
