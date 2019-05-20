import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';

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
      Add one or more prompts below to frame the task for the user. You can reorder
      the prompts using the draggable handles on the left hand side.
    </p>
    <p><strong>Tip: Tap an existing prompt to edit it.</strong></p>
  </EditableList>
);

export { NameGeneratorPrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(NameGeneratorPrompts);
