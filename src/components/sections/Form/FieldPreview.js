import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { getCodebook } from '@selectors/codebook';
import withSubject from '../../enhancers/withSubject';
import Preview from '../../EditableList/Preview';
import Badge from '../../Badge';
import { getColorForType } from '../../Form/inputOptions';

const PreviewFieldComponent = ({
  input: {
    value,
  },
  subjectVariables,
}) => {
  const codebookVariable = get(subjectVariables, value.variable, {});
  return (
    <div>
      {value.prompt}
      <Badge color={getColorForType(codebookVariable.type)}>
        <strong>{codebookVariable.type}</strong> variable
        using <strong>{codebookVariable.component}</strong> component
      </Badge>
    </div>
  );
};

PreviewFieldComponent.propTypes = {
  input: PropTypes.object.isRequired,
  subjectVariables: PropTypes.object.isRequired,
};

class PromptPreview extends Preview {
  preview() {
    const fieldId = this.props.fieldId;
    return (
      <Field
        name={fieldId}
        component={PreviewFieldComponent}
        subjectVariables={this.props.subjectVariables}
      />
    );
  }
}

PromptPreview.propTypes = {
  fieldId: PropTypes.string.isRequired,
};

// TODO: Update this to use the new array format getVariables
const mapStateToProps = (state, { entity, type }) => ({
  subjectVariables: get(getCodebook(state), [entity, type, 'variables'], {}),
});

export { PromptPreview };

export default compose(
  withSubject,
  connect(mapStateToProps),
)(PromptPreview);

