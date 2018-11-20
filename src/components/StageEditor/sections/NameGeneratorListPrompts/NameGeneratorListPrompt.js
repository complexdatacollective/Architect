import React from 'react';
import PropTypes from 'prop-types';
import { ValidatedField } from '../../../Form';
import TextArea from '../../../../ui/components/Fields/TextArea';
import Select from '../../../Form/Fields/Select';
import AttributesTable from '../../../AttributesTable';
import { Item, Section } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';

const NameGeneratorPrompt = ({
  handleValidateAttributes,
  fieldId,
  form,
  nodeType,
  dataSources,
  ...rest
}) => (
  <Item {...rest}>
    <Section>
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
    </Section>
    <Section>
      <div id={getFieldId(`${fieldId}.additionalAttributes`)} data-name="Prompt additional attributes" />
      <h3>Additional attributes</h3>
      <AttributesTable
        name={`${fieldId}.additionalAttributes`}
        id="additionalAttributes"
        nodeType={nodeType}
      />
      <div id={getFieldId(`${fieldId}.dataSource`)} data-name="Prompt data-source" />
    </Section>
    <Section>
      <h3>Data-source</h3>
      <ValidatedField
        component={Select}
        name={`${fieldId}.dataSource`}
        id="dataSource"
        options={dataSources}
        validation={{ required: true }}
      />
    </Section>
  </Item>
);

/**
 * cardOptions.displayLabel
 * cardOptions.additionalProperties
 * sortOptions.sortOrder
 * sortOptions.sortableProperties
 */

NameGeneratorPrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  nodeType: PropTypes.string,
  dataSources: PropTypes.array,
};

NameGeneratorPrompt.defaultProps = {
  nodeType: null,
  dataSources: [],
};

export { NameGeneratorPrompt };

export default NameGeneratorPrompt;
