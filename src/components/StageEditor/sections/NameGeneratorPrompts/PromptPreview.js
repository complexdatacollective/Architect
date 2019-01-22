import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Preview from '../../../Prompts/PromptPreview';

const PromptPreview = ({
  fieldId,
  handleEditField,
  editField,
}) => (
  <Preview
    onClickPrompt={handleEditField}
    editField={editField}
    fieldId={fieldId}
  >
    <Field
      name={`${fieldId}.text`}
      component={({ input: { value } }) => value}
    />
  </Preview>
);

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { PromptPreview };

export default PromptPreview;
