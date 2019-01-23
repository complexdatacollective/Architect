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
      <React.Fragment>
        <div className="prompts-prompt-preview__icon">
          <Field
            name={`${fieldId}.subject.type`}
            component={
              field => <PreviewNode type={field.input.value} className="foo" />
            }
          />
        </div>
        <Field
          name={`${fieldId}.text`}
          component={field => <Markdown source={field.input.value} />}
        />
      </React.Fragment>
    );
  }
}

PromptPreview.ReactpropTypes = {
  fieldId: PropTypes.string.isRequired,
};

export default PromptPreview;
