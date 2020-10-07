import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import EditableList from '../../EditableList';
import withSubject from '../../enhancers/withSubject';
import withDisabledSubjectRequired from '../../enhancers/withDisabledSubjectRequired';
import { PromptPreview } from '../NameGeneratorPrompts';
import PromptFields from './PromptFields';
import { itemSelector } from '../CategoricalBinPrompts/helpers';
import withPromptChangeHandler from '../CategoricalBinPrompts/withPromptChangeHandler';
// import Tip from '../../Tip';

const template = () => ({ color: 'ord-color-seq-1' });

const OrdinalBinPrompts = ({ handleChangePrompt, ...props }) => (
  <EditableList
    contentId="guidance.editor.ordinal_bin_prompts"
    previewComponent={PromptPreview}
    editComponent={PromptFields}
    title="Edit Prompt"
    template={template}
    onChange={handleChangePrompt}
    itemSelector={itemSelector(props.entity, props.type)}
    {...props}
  >
    <h2>Prompts</h2>
    <p>
      Add one or more prompts below to frame the task for the user.
      You can reorder the prompts using the draggable handles on the left hand side.
    </p>
    {/* <Tip>
      <p>Tap an existing prompt to edit it.</p>
    </Tip> */}
  </EditableList>
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

export { OrdinalBinPrompts };

export default compose(
  withSubject,
  withDisabledSubjectRequired,
  withPromptChangeHandler,
)(OrdinalBinPrompts);
