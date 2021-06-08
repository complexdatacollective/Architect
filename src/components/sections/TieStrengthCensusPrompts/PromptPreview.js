import React from 'react';
import PropTypes from 'prop-types';
import { Markdown } from '@codaco/ui/lib/components/Fields';
import { Field } from 'redux-form';
import Preview from '../../EditableList/Preview';

class PromptPreview extends Preview {
  preview() {
    const { fieldId } = this.props;

    return (
      <Field
        name={`${fieldId}.text`}
        component={(field) => <Markdown label={field.input.value} />}
      />
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export default PromptPreview;
