import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field } from 'redux-form';
import { getVariable } from '@selectors/codebook';
import { getColorForType } from '@components/Form/inputOptions';
import Preview from '@components/EditableList/Preview';
import Badge from '@components/Badge';

const withVariableMeta = connect(
  (state, { input }) => ({
    variableMeta: getVariable(state, { id: input.value.variable }),
  }),
);

const PreviewFieldComponent = withVariableMeta(({
  input: { value },
  variableMeta,
}) => (
  <div>
    {value.prompt}
    <Badge color={getColorForType(variableMeta.properties.type)}>
      <strong>{variableMeta.properties.name}&lt;{variableMeta.properties.type}&gt;</strong>
      {' '}variable using{' '}
      <strong>{variableMeta.properties.component}</strong> component
    </Badge>
  </div>
));

PreviewFieldComponent.propTypes = {
  input: PropTypes.object.isRequired,
  variableMeta: PropTypes.object.isRequired,
};

class PromptPreview extends Preview {
  preview() {
    const fieldId = this.props.fieldId;
    return (
      <Field
        name={fieldId}
        component={PreviewFieldComponent}
        codebookVariables={this.props.codebookVariables}
      />
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};


export { PromptPreview };

export default PromptPreview;

