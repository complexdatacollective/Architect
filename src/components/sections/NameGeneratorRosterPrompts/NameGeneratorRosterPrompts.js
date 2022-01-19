import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withDisabledAssetRequired from '../../enhancers/withDisabledAssetRequired';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from '../NameGeneratorPrompts/PromptFields';
import withMapFormToProps from '../../enhancers/withMapFormToProps';

const NameGeneratorRosterPrompts = (props) => (
  <EditableList
    sectionTitle="Prompts"
    editComponent={PromptFields}
    previewComponent={PromptPreview}
    title="Edit Prompt"
    sectionSummary={(
      <p>
        Add one or more prompts below to frame the task for the user. You can reorder
        the prompts using the draggable handles on the left hand side.
      </p>
    )}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export { NameGeneratorRosterPrompts };

export default compose(
  withSubject,
  withMapFormToProps('dataSource'),
  withDisabledSubjectRequired,
  withDisabledAssetRequired,
)(NameGeneratorRosterPrompts);
