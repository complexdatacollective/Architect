import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import SeamlessText from '../../../Form/Fields/SeamlessText';
import VariableChooser from '../../../Form/Fields/VariableChooser';

const NameGeneratorPrompt = ({ fieldId, form, variableRegistry }) => (
  <div className="prompt">
    <div className="prompt__setting">
      <div className="prompt__setting-label">Text for prompt</div>
      <Field
        name={`${fieldId}.text`}
        component={SeamlessText}
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
        form={form}
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

export default NameGeneratorPrompt;
