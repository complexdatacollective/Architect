import { compose } from 'recompose';

import EditableList from '../../EditableList';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withSubject from '../../enhancers/withSubject';
import PromptFields from './PromptFields';
import PromptPreview from './PromptPreview';
import withFormUsedVariableIndex from './withFormUsedVariableIndex';

// TODO no prop spreading
const SociogramPrompts = (props) => (
  <EditableList
    sectionTitle="Prompts"
    sectionSummary={
      <p>
        Add one or more prompts below to frame the task for the user. You can
        reorder the prompts using the draggable handles on the left hand side.
      </p>
    }
    title="Edit Prompt"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    {...props}
  />
);

export default compose(
  withSubject,
  withFormUsedVariableIndex,
  withDisabledSubjectRequired,
)(SociogramPrompts);
