import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import * as Fields from '../../../Form/Fields';

const NameGeneratorPrompt = ({
  fieldId,
  form,
}) => (
  <div className="stage-editor-section-name-generator-prompt">
    <div className="stage-editor-section-name-generator-prompt__setting">
      <div className="stage-editor-section-name-generator-prompt__setting-label">Text for prompt</div>
      <Field
        name={`${fieldId}.text`}
        component={Fields.Markdown}
        className="stage-editor-section-name-generator-prompt__setting-value"
        placeholder="Enter text for the prompt here"
      />
    </div>
  </div>
);

NameGeneratorPrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  variableRegistry: PropTypes.object,
};

NameGeneratorPrompt.defaultProps = {
  variableRegistry: {},
};

export { NameGeneratorPrompt };

export default connect(
  mapStateToProps,
)(
  NameGeneratorPrompt,
);
