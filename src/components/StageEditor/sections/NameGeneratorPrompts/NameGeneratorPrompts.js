import React from 'react';
import NameGeneratorPrompt from './NameGeneratorPrompt';
import Prompts from '../../../Prompts';

const NameGeneratorPrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_prompts"
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

export { NameGeneratorPrompts };

export default NameGeneratorPrompts;
