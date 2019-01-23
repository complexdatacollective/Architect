import React from 'react';
import { withProps, compose } from 'recompose';
import Prompts, { withSubjectNodeType } from '../../../Prompts';
import PromptPreview from './PromptPreview';
import PromptForm from './PromptForm';

const NameGeneratorAutoCompletePrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_auto_complete_prompts"
    editComponent={PromptForm}
    previewComponent={PromptPreview}
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

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(NameGeneratorAutoCompletePrompts);
