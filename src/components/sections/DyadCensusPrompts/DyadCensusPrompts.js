import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';

const NameGeneratorPrompts = (props) => (
  <EditableList
    sectionTitle="Prompts"
    sectionSummary={(
      <p>
        Add one or more prompts below to frame the task for the user. You can reorder
        the prompts using the draggable handles on the left hand side.
      </p>
    )}
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    fieldName="prompts"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export { NameGeneratorPrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(NameGeneratorPrompts);
