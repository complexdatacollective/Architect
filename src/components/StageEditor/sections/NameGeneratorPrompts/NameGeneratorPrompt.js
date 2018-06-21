import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import Markdown from '../../../Form/Fields/Markdown';
import VariableChooser from '../../../Form/Fields/VariableChooser';
import { Item } from '../../Sortable';

const NameGeneratorPrompt = ({ fieldId, form, variableRegistry, ...rest }) => (
  <Item {...rest}>
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
  </Item>
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
