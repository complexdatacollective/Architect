import React from 'react';
import { withProps, compose } from 'recompose';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';

const NameGeneratorPrompts = props => (
  <EditableList
    contentId="guidance.editor.name_generator_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    fieldName="prompts"
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to ecourage your participants to create
      nodes.
    </p>
  </EditableList>
);

export { NameGeneratorPrompts };

export default compose(
  withSubject,
  withProps(({ type }) => ({ disabled: !type })),
)(NameGeneratorPrompts);
