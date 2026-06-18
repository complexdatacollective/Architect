import EditableList from '@components/EditableList';
import withDisabledSubjectRequired from '@components/enhancers/withDisabledSubjectRequired';
import withSubject from '@components/enhancers/withSubject';
import { itemSelector } from '@components/sections/CategoricalBinPrompts/helpers';
import withPromptChangeHandler from '@components/sections/CategoricalBinPrompts/withPromptChangeHandler';
import { PromptPreview } from '@components/sections/NameGeneratorPrompts';
import PropTypes from 'prop-types';
import { compose } from 'recompose';

import PromptFields from './PromptFields';

const template = () => ({ color: 'ord-color-seq-1' });

const OrdinalBinPrompts = ({ handleChangePrompt, entity, type, ...props }) => (
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
    template={template}
    onChange={handleChangePrompt}
    itemSelector={itemSelector(entity, type)}
    entity={entity}
    type={type}
    {...props}
  />
);

OrdinalBinPrompts.propTypes = {
  handleChangePrompt: PropTypes.func.isRequired,
  entity: PropTypes.string,
  type: PropTypes.string,
};

OrdinalBinPrompts.defaultProps = {
  entity: null,
  type: null,
};

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withPromptChangeHandler,
)(OrdinalBinPrompts);
