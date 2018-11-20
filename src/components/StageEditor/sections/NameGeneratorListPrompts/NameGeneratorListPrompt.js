import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, uniq, keys } from 'lodash';
import { ValidatedField } from '../../../Form';
import TextArea from '../../../../ui/components/Fields/TextArea';
import Select from '../../../Form/Fields/Select';
import AttributesTable from '../../../AttributesTable';
import { Item, Section } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';
import { getExternalData, getVariableRegistry } from '../../../../selectors/protocol';

const NameGeneratorPrompt = ({
  handleValidateAttributes,
  fieldId,
  form,
  nodeType,
  dataSources,
  externalDataPropertyOptions,
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
    <Section id={getFieldId(`${fieldId}.dataSource`)} data-name="Data source">
      <h3>Data-source</h3>
      <ValidatedField
        component={Select}
        name={`${fieldId}.dataSource`}
        id="dataSource"
        options={dataSources}
        validation={{ required: true }}
      />
    </Section>
    <Section id={getFieldId(`${fieldId}.displayLabel`)} data-name="Display Label">
      <h3>Display Label</h3>
      <ValidatedField
        component={Select}
        name={`${fieldId}.displayLabel`}
        id="displayLabel"
        options={externalDataPropertyOptions}
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
  externalDataPropertyOptions: [],
};

NameGeneratorPrompt.defaultProps = {
  nodeType: null,
  dataSources: [],
  externalDataPropertyOptions: [],
};

// "nodes": [
//   {
//     "type": "4aebf73e-95e3-4fd1-95e7-237dcc4a4466",
//     "attributes": {
//       "6be95f85-c2d9-4daf-9de1-3939418af888": "Anita",
//       "0ff25001-a2b8-46de-82a9-53143aa00d10": "Li",
//       "0e75ec18-2cb1-4606-9f18-034d28b07c19": "Annie",
//       "c5fee926-855d-4419-b5bb-54e89010cea6": 23
//     }

const mapStateToProps = (state, { fieldId, form, nodeType }) => {
  if (!nodeType) { return {}; }

  const dataSource = form.getValues(state, `${fieldId}.dataSource`);
  const externalData = get(getExternalData(state), dataSource, { nodes: [] });
  const variableRegistry = getVariableRegistry(state);

  const dataAttributes = externalData.nodes
    .filter(node => node.type === nodeType)
    .reduce((memo, node) => uniq([...memo, ...keys(node.attributes)]), []);

  const externalDataPropertyOptions = dataAttributes.map(
    attributeId => ({
      // should we check it exists in registry? and omit if not
      label: get(variableRegistry, ['node', nodeType, 'variables', attributeId, 'name'], attributeId),
      value: attributeId,
    }),
  );

  return {
    externalDataPropertyOptions,
  };
};

export { NameGeneratorPrompt };

export default connect(mapStateToProps)(NameGeneratorPrompt);
