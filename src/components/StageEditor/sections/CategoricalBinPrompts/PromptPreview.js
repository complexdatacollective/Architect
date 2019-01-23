import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field } from 'redux-form';
import Preview from '../../../Prompts/PromptPreview';

class PromptPreview extends Preview {
  preview() {
    const fieldId = this.props.fieldId;

    return (
      <div className="stage-editor-section-prompt__preview--centered">
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

export { PromptPreview };

export default PromptPreview;
