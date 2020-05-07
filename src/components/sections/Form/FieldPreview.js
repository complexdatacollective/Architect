import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { getColorForType } from '@app/config/variables';
import { getVariablesForSubject } from '@selectors/codebook';
import withSubject from '@components/enhancers/withSubject';
import Preview from '@components/EditableList/Preview';
import Badge from '@components/Badge';

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
        using <strong>{codebookVariable.component}</strong> input control
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

const mapStateToProps = (state, props) => ({
  subjectVariables: getVariablesForSubject(state, props),
});

export { PromptPreview };

export default compose(
  withSubject,
  connect(mapStateToProps),
)(PromptPreview);

