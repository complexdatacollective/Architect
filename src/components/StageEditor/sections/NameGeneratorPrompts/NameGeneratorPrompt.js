import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { SeamlessTextInput, VariableChooser } from '../../../Form';

const NameGeneratorPrompt = ({ fieldId, variableRegistry }) => (
  <div className="prompt">
    <div className="prompt__setting">
      <div className="prompt__setting-label">Text for prompt</div>
      <Field
        name={`${fieldId}.text`}
        component={SeamlessTextInput}
        className="prompt__setting-value"
        placeholder="Enter text for the prompt here"
      />
    </div>
    <div className="prompt__setting">
      <div className="prompt__setting-label">Additional attributes</div>
      <VariableChooser
        className="prompt__setting-value"
        name={`${fieldId}.additionalAttributes`}
        variableRegistry={variableRegistry}
      />
    </div>
  </div>
);

NameGeneratorPrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  variableRegistry: PropTypes.object,
};

NameGeneratorPrompt.defaultProps = {
  variableRegistry: {},
};

export { NameGeneratorPrompt };

export default NameGeneratorPrompt;
