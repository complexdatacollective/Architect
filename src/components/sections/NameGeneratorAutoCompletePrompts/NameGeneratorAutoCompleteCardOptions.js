import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';

const NameGeneratorAutoCompletePrompts = (props) => (
  <EditableList
    editComponent={PromptFields}
    previewComponent={PromptPreview}
    title="Edit Prompt"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more prompts below to frame the task for the user. You can reorder
      the prompts using the draggable handles on the left hand side.
    </p>
  </EditableList>
);

export { NameGeneratorAutoCompletePrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(NameGeneratorAutoCompletePrompts);
