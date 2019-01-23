import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field } from 'redux-form';
import Preview from '../../../Prompts/PromptPreview';
import PreviewNode from '../../../PreviewNode';

class PromptPreview extends Preview {
  preview() {
    const {
      fieldId,
    } = this.props;

    return (
      <div className="stage-editor-section-sociogram-prompt__preview">
        <div className="stage-editor-section-sociogram-prompt__preview-icon">
          <Field
            name={`${fieldId}.subject.type`}
            component={
              field => <PreviewNode type={field.input.value} />
            }
          />
        </div>
        <Field
          name={`${fieldId}.text`}
          component={field => (
            <Markdown
              className="stage-editor-section-sociogram-prompt__preview-text"
              source={field.input.value}
            />
          )}
        />
      </div>
    );
  }
}

PromptPreview.ReactpropTypes = {
  fieldId: PropTypes.string.isRequired,
};

export default PromptPreview;
