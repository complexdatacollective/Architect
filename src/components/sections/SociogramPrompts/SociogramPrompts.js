import React from 'react';
import { withProps, compose } from 'recompose';
import PromptPreview from './PromptPreview';
import PromptFields from './PromptFields';
import EditableList, { withSubjectNodeType } from '../../EditableList';
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
  withSubjectNodeType,
  withFormUsedVariableIndex,
  withProps(({ nodeType }) => ({ disabled: !nodeType })),
)(SociogramPrompts);
