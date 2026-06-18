import PropTypes from 'prop-types';
import { compose } from 'recompose';

import EditableList from '../../EditableList';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import withSubject from '../../enhancers/withSubject';
import { PromptPreview } from '../NameGeneratorPrompts';
import { itemSelector, normalizeField } from './helpers';
import PromptFields from './PromptFields';
import withPromptChangeHandler from './withPromptChangeHandler';

const CategoricalBinPrompts = ({
  handleChangePrompt,
  entity,
  type,
  ...props
}) => (
  <EditableList
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    onChange={handleChangePrompt}
    normalize={normalizeField}
    itemSelector={itemSelector(entity, type)}
    entity={entity}
    type={type}
    sectionTitle="Edit Prompts"
    sectionSummary={
      <p>
        Add one or more prompts below to frame the task for the user. You can
        reorder the prompts using the draggable handles on the left hand side.
      </p>
    }
    {...props}
  />
);

CategoricalBinPrompts.propTypes = {
  handleChangePrompt: PropTypes.func.isRequired,
  entity: PropTypes.string,
  type: PropTypes.string,
};

CategoricalBinPrompts.defaultProps = {
  entity: null,
  type: null,
};

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withPromptChangeHandler,
)(CategoricalBinPrompts);
