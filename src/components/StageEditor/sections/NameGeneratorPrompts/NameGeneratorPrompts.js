import React from 'react';
import { withProps, compose } from 'recompose';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';
import Prompts, { withSubjectNodeType } from '../../../Prompts';

const NameGeneratorPrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
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

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(NameGeneratorPrompts);
