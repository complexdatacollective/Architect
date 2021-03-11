import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Preview from '../EditableList/Preview';

class VariablePreview extends Preview {
  preview() {
    const { fieldId } = this.props;

    return (
      <Field
        name={`${fieldId}.name`}
        component={(field) => field.input.value}
      />
    );
  }
}

VariablePreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { VariablePreview };

export default VariablePreview;
