import React from 'react';
import { withProps, compose } from 'recompose';
import Prompts, { withSubjectNodeType } from '../../../Prompts';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const NameGeneratorListPrompts = props => (
  <Prompts
    contentId="guidance.editor.name_generator_list_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
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

export { NameGeneratorListPrompts };

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(NameGeneratorListPrompts);
