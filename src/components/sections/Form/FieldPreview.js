import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { getVariables } from '@selectors/codebook';
import withSubject from '../../enhancers/withSubject';
import Preview from '../../EditableList/Preview';
import Badge from '../../Badge';
import { getColorForType } from '../../Form/inputOptions';

const PreviewFieldComponent = ({
  input: {
    value,
  },
  codebookVariables,
}) => {
  const codebookVariable = codebookVariables
    .find(({ id }) => id === value.variable);
  return (
    <div>
      {value.prompt}
      <Badge color={getColorForType(codebookVariable.properties.type)}>
        <strong>{codebookVariable.properties.type}</strong> variable
        using <strong>{codebookVariable.properties.component}</strong> component
      </Badge>
    </div>
  );
};

PreviewFieldComponent.propTypes = {
  input: PropTypes.object.isRequired,
  codebookVariables: PropTypes.object.isRequired,
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

// TODO: Update this to use the new array format getVariables
const mapStateToProps = (state, { entity, type }) => ({

  codebookVariables: getVariables(state, { subject: { entity, type } }),
  // subjectVariables: get(getCodebook(state), [entity, type, 'variables'], {}),
});

export { PromptPreview };

export default compose(
  withSubject,
  connect(mapStateToProps),
)(PromptPreview);

