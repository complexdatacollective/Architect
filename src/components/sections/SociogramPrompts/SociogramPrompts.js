import React from 'react';
import { withProps, compose } from 'recompose';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withFormUsedVariableIndex from './withFormUsedVariableIndex';

const template = () => ({ sortOrder: [] });

const SociogramPrompts = props => (
  <EditableList
    contentId="guidance.editor.sociogram_prompts"
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
  withProps(({ entity }) => ({ disabled: !entity })),
)(SociogramPrompts);
