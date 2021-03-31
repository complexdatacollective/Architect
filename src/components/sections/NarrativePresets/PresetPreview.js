import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import { Field } from 'redux-form';
import Preview from '../../EditableList/Preview';

class PresetPreview extends Preview {
  preview() {
    const { fieldId } = this.props;

    return (
      <Field
        name={`${fieldId}.label`}
        component={(field) => <Markdown source={field.input.value} />}
      />
    );
  }
}

PresetPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export default PresetPreview;
