import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Preview from '../../EditableList/Preview';
import Badge from '../../Badge';
import { getColorForType, getTypeForComponent } from './inputOptions';

const PreviewFieldComponent = ({
  input: {
    value,
  },
}) => {
  const type = getTypeForComponent(value.component);

  return (
    <div>
      {value.prompt}
      <Badge color={getColorForType(type)}>{value.component}:{type}</Badge>
    </div>
  );
};

PreviewFieldComponent.propTypes = {
  input: PropTypes.object.isRequired,
};

class PromptPreview extends Preview {
  preview() {
    const fieldId = this.props.fieldId;

    return (
      <Field
        name={fieldId}
        component={PreviewFieldComponent}
      />
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

export { PromptPreview };

export default PromptPreview;
