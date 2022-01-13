import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withMapFormToProps from '../../enhancers/withMapFormToProps';
import withDisabledAssetRequired from '../../enhancers/withDisabledAssetRequired';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from '../NameGeneratorPrompts/PromptFields';

const template = () => ({});

const NameGeneratorListPrompts = (props) => (
  <EditableList
    sectionTitle="Prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    sectionSummary={(
      <p>
        Add one or more prompts below to frame the task for the user. You can reorder
        the prompts using the draggable handles on the left hand side.
      </p>
    )}
    template={template}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export { NameGeneratorListPrompts };

export default compose(
  withSubject,
  withMapFormToProps('dataSource'),
  withDisabledSubjectRequired,
  withDisabledAssetRequired,
)(NameGeneratorListPrompts);
