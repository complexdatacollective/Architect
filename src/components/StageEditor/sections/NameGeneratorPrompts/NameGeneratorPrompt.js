import React from 'react';
import PropTypes from 'prop-types';
import { ValidatedField } from '../../../Form';
import Markdown from '../../../Form/Fields/Markdown';
import VariableChooser from '../../../Form/Fields/VariableChooser';
import { Item } from '../../Sortable';
import { getFieldId } from '../../../../utils/issues';

const NameGeneratorPrompt = ({ fieldId, form, variableRegistry, ...rest }) => (
  <Item {...rest}>
    <div id={getFieldId(`${fieldId}.text`)} />
    <ValidatedField
      name={`${fieldId}.text`}
      component={Markdown}
      label="Text for prompt"
      id="text"
      className="stage-editor-section-prompt__setting-value"
      placeholder="Enter text for the prompt here"
      validation={{ required: true }}
    />
    <VariableChooser
      className="stage-editor-section-prompt__setting-value"
      name={`${fieldId}.additionalAttributes`}
      id="additionalAttributes"
      variableRegistry={variableRegistry}
      label="Additional attributes"
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
