import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';
import { itemSelector, normalizeField } from './helpers';
import withPromptChangeHandler from './withPromptChangeHandler';
// import Tip from '../../Tip';

const CategoricalBinPrompts = ({ handleChangePrompt, ...props }) => (
  <EditableList
    contentId="guidance.editor.categorical_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    onChange={handleChangePrompt}
    normalize={normalizeField}
    itemSelector={itemSelector(props.entity, props.type)}
    {...props}
  >
    <h2>Edit Prompts</h2>
    <p>
      Add one or more prompts below to frame the task for the user. You can reorder
      the prompts using the draggable handles on the left hand side.
    </p>
    {/* <Tip>
      <p>Tap an existing prompt to edit it.</p>
    </Tip> */}
  </EditableList>
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
export { CategoricalBinPrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withPromptChangeHandler,
)(CategoricalBinPrompts);
