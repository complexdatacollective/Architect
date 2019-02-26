import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field } from 'redux-form';
import Preview from '../../../EditableList/Preview';

class PromptPreview extends Preview {
  preview() {
    const {
      fieldId,
    } = this.props;

    return (
      <React.Fragment>
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
