import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field } from 'redux-form';
import Preview from '../../../Prompts/PromptPreview';

class PromptPreview extends Preview {
  preview() {
    const fieldId = this.props.fieldId;

    return (
      <Field
        name={`${fieldId}.text`}
        component={field => <Markdown source={field.input.value} />}
      />
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { PromptPreview };

export default PromptPreview;
