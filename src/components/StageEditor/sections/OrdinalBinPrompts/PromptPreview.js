import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Markdown from 'react-markdown';
import Preview from '../../../Prompts/PromptPreview';

class PromptPreview extends Preview {
  preview() {
    const fieldId = this.props.fieldId;

    return (
      <div>
        <Field
          name={`${fieldId}.text`}
          component={field => <Markdown source={field.input.value} />}
        />
      </div>
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export default PromptPreview;
