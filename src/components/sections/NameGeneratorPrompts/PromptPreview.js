import React from 'react';
import PropTypes from 'prop-types';
import { Markdown } from '@codaco/ui/lib/components/Fields';
import { Field } from 'redux-form';
import Preview from '../../EditableList/Preview';

const MarkdownPreview = ({ input }) => (
  <Markdown label={input.value} />
);

class PromptPreview extends Preview {
  preview() {
    const { fieldId } = this.props;

    return (
      <Field
        name={`${fieldId}.text`}
        component={MarkdownPreview}
      />
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export default PromptPreview;
