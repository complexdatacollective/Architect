import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const NameGeneratorAutoCompletePrompts = props => (
  <EditableList
    contentId="guidance.editor.name_generator_auto_complete_prompts"
    editComponent={PromptFields}
    previewComponent={PromptPreview}
    title="Edit Prompt"
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more &quot;prompts&quot; below, to ecourage your participants to create
      nodes.
    </p>
  </EditableList>
);

export { NameGeneratorAutoCompletePrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(NameGeneratorAutoCompletePrompts);
