import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const template = () => ({ color: 'ord-color-seq-1' });

const OrdinalBinPrompts = props => (
  <EditableList
    contentId="guidance.editor.ordinal_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    template={template}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more prompts below to frame the task for the user.
      You can reorder the prompts using the draggable handles on the left hand side.
    </p>
    <p><strong>Tip: Tap an existing prompt to edit it.</strong></p>
  </EditableList>
);

export { OrdinalBinPrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(OrdinalBinPrompts);
