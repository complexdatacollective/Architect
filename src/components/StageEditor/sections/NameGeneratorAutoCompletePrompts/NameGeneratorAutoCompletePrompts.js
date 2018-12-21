import React from 'react';
import Prompts from '../../../Prompts';
import NameGeneratorPrompt from './NameGeneratorAutoCompletePrompt';

const NameGeneratorAutoCompletePrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_auto_complete_prompts"
    promptComponent={NameGeneratorPrompt}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to ecourage your participants to create
      nodes.
    </p>
  </Prompts>
);

export { NameGeneratorAutoCompletePrompts };

export default NameGeneratorAutoCompletePrompts;
