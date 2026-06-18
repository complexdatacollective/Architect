import { compose } from 'recompose';

import EditableList from '../../EditableList';
import withDisabledAssetRequired from '../../enhancers/withDisabledAssetRequired';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withMapFormToProps from '../../enhancers/withMapFormToProps';
import withSubject from '../../enhancers/withSubject';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from '../NameGeneratorPrompts/PromptFields';

const NameGeneratorRosterPrompts = (props) => (
  <EditableList
    sectionTitle="Prompts"
    editComponent={PromptFields}
    previewComponent={PromptPreview}
    title="Edit Prompt"
    sectionSummary={
      <p>
        Add one or more prompts below to frame the task for the user. You can
        reorder the prompts using the draggable handles on the left hand side.
      </p>
    }
    {...props}
  />
);

export default compose(
  withSubject,
  withMapFormToProps('dataSource'),
  withDisabledSubjectRequired,
  withDisabledAssetRequired,
)(NameGeneratorRosterPrompts);
