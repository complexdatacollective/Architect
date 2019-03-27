import React from 'react';
import { withProps, compose } from 'recompose';
import EditableList, { withSubjectNodeType } from '../../EditableList';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const template = () => ({ showExistingNodes: true });

const NameGeneratorListPrompts = props => (
  <EditableList
    contentId="guidance.editor.name_generator_list_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    template={template}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to ecourage your participants to create
      nodes.
    </p>
  </EditableList>
);

export { NameGeneratorListPrompts };

export default compose(
  withSubjectNodeType,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(NameGeneratorListPrompts);
