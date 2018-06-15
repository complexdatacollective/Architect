import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Markdown from '../../../Form/Fields/Markdown';
import VariableChooser from '../../../Form/Fields/VariableChooser';

const NameGeneratorPrompt = ({ fieldId, form, variableRegistry }) => (
  <div className="stage-editor-section-prompt stage-editor-section-prompt--open">
    <div className="stage-editor-section-prompt__editor">
      <div className="stage-editor-section-prompt__group">
        <Field
          name={`${fieldId}.text`}
          component={Markdown}
          label="Text for prompt"
          className="stage-editor-section-prompt__setting-value"
          placeholder="Enter text for the prompt here"
        />
        <h5 className="stage-editor-section-prompt__label">Additional attributes</h5>
        <VariableChooser
          className="stage-editor-section-prompt__setting-value"
          name={`${fieldId}.additionalAttributes`}
          variableRegistry={variableRegistry}
          form={form}
        />
      </div>
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
