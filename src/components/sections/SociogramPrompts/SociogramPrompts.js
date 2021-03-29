/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withFormUsedVariableIndex from './withFormUsedVariableIndex';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';

const template = () => ({ sortOrder: [] });

// TODO no prop spreading
const SociogramPrompts = (props) => (
  <EditableList
    title="Edit Prompt"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    template={template}
    {...props}
  >
    <h2>Prompts</h2>
    <p>Add prompts to your Sociogram:</p>
  </EditableList>
);

export { SociogramPrompts };

export default compose(
  withSubject,
  withFormUsedVariableIndex,
  withDisabledSubjectRequired,
)(SociogramPrompts);
