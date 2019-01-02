import React from 'react';
import Prompts from '../../../Prompts';
import CategoricalBinPrompt from './CategoricalBinPrompt';

const CategoricalBinPrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_list_prompts"
    promptComponent={CategoricalBinPrompt}
    template={{ showExistingNodes: true }}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to ecourage your participants to create
      nodes.
    </p>
  </Prompts>
);

export { CategoricalBinPrompts };

export default CategoricalBinPrompts;
