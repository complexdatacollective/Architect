import PropTypes from 'prop-types';
import { compose } from 'recompose';

import EditableList from '../../EditableList';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withSubject from '../../enhancers/withSubject';
import { itemSelector } from './helpers';
import PromptFields from './PromptFields';
import PromptPreview from './PromptPreview';
import withPromptChangeHandler from './withPromptChangeHandler';

const TieStrengthCensusPrompts = ({ handleChangePrompt, ...props }) => (
  <EditableList
    sectionTitle="Prompts"
    sectionSummary={
      <p>
        Add one or more prompts below to frame the task for the user. You can
        reorder the prompts using the draggable handles on the left hand side.
      </p>
    }
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    fieldName="prompts"
    itemSelector={itemSelector()}
    onChange={handleChangePrompt}
    {...props}
  />
);

TieStrengthCensusPrompts.propTypes = {
  handleChangePrompt: PropTypes.func.isRequired,
};

TieStrengthCensusPrompts.defaultProps = {};

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withPromptChangeHandler,
)(TieStrengthCensusPrompts);
