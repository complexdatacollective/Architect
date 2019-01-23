import React from 'react';
import PromptPreview from './PromptPreview';
import PromptForm from './PromptForm';
import Prompts from '../../../Prompts';

const SociogramPrompts = props => (
  <Prompts
    contentId="guidance.editor.sociogram_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptForm}
    template={{ sortOrder: [] }}
    {...props}
  >
    <h2>Prompts</h2>
    <p>Add prompts to your Sociogram:</p>
  </Prompts>
);

export default SociogramPrompts;
