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
      Add one or more &quot;prompts&quot; below.
    </p>
  </EditableList>
);

export { OrdinalBinPrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
)(OrdinalBinPrompts);
