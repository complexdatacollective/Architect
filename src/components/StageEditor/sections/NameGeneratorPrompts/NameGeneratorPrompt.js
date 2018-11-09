import React from 'react';
import PropTypes from 'prop-types';
import { ValidatedField } from '../../../Form';
import TextArea from '../../../../ui/components/Fields/TextArea';
import AttributesTable from './AttributesTable';
import { Item } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';

const NameGeneratorPrompt = ({ fieldId, form, nodeType, ...rest }) => (
  <Item {...rest}>
    <div id={getFieldId(`${fieldId}.text`)} data-name="Prompt text" />
    <h3>Text for Prompt</h3>
    <ValidatedField
      name={`${fieldId}.text`}
      component={TextArea}
      className="stage-editor-section-prompt__textarea"
      label=""
      placeholder="Enter text for the prompt here"
      validation={{ required: true }}
    />
    <div id={getFieldId(`${fieldId}.additionalAttributes`)} data-name="Prompt additional attributes" />
    <h3>Additional attributes</h3>
    <AttributesTable
      name={`${fieldId}.additionalAttributes`}
      id="additionalAttributes"
      nodeType={nodeType}
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
  nodeType: PropTypes.string,
};

NameGeneratorPrompt.defaultProps = {
  nodeType: null,
};

export { NameGeneratorPrompt };

export default NameGeneratorPrompt;
