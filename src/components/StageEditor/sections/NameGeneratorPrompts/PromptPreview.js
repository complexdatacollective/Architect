import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Preview from '../../../Prompts/PromptPreview';

class PromptPreview extends Preview {
  preview() {
    const fieldId = this.props.fieldId;

    return (
      <Field
        name={`${fieldId}.text`}
        component={({ input: { value } }) => value}
      />
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { PromptPreview };

export default PromptPreview;
