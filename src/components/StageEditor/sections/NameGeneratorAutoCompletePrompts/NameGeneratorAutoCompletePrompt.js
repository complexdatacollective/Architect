import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, uniq, keys, map } from 'lodash';
import { Field } from 'redux-form';
import { ValidatedField } from '../../../Form';
import * as Fields from '../../../../ui/components/Fields';
import Select from '../../../Form/Fields/Select';
import MultiSelect from '../../../Form/MultiSelect';
import AttributesTable from '../../../AttributesTable';
import { Item, Row, Group } from '../../../OrderedList';
import { getFieldId } from '../../../../utils/issues';
import { getExternalData, getVariableRegistry } from '../../../../selectors/protocol';

/**
 * Creates a optionGetter function, `f(property, rowValues, allValues)`, which returns a list of
 * options depending on the value of `property`, `rowValues`, `allValues`.
 *
 * This optionGetter is for additionalProperties, and removes the item being used as the
 * displayLabel.
 */
const getAdditionalPropertiesOptionGetter = (externalDataPropertyOptions, displayLabel) =>
  (property, rowValues, allValues) => {
    const used = map(allValues, 'variable');

    return externalDataPropertyOptions
      .map(
        option => (!used.includes(option.value) ? option : { ...option, isDisabled: true }),
      )
      .filter(({ value }) => value !== displayLabel);
  };

const NameGeneratorAutoCompletePrompt = ({
  handleValidateAttributes,
  fieldId,
  form,
  nodeType,
  dataSources,
  dataSource,
  displayLabel,
  externalDataPropertyOptions,
  ...rest
}) => {
  const additionalPropertiesOptions = getAdditionalPropertiesOptionGetter(
    externalDataPropertyOptions,
    displayLabel,
  );

  return (
    <Item {...rest}>
      <Row>
        <div id={getFieldId(`${fieldId}.text`)} data-name="Prompt text" />
        <h3>Text for Prompt</h3>
        <ValidatedField
          name={`${fieldId}.text`}
          component={Fields.TextArea}
          label=""
          placeholder="Enter text for the prompt here"
          validation={{ required: true }}
        />
      </Row>
      <Row>
        <div id={getFieldId(`${fieldId}.additionalAttributes`)} data-name="Prompt additional attributes" />
        <h3>Additional attributes</h3>
        <AttributesTable
          name={`${fieldId}.additionalAttributes`}
          id="additionalAttributes"
          nodeType={nodeType}
        />
        <div id={getFieldId(`${fieldId}.dataSource`)} data-name="Prompt data-source" />
      </Row>
      <Row id={getFieldId(`${fieldId}.dataSource`)} data-name="Data source">
        <h3>Data-source</h3>
        <ValidatedField
          component={Select}
          name={`${fieldId}.dataSource`}
          id="dataSource"
          options={dataSources}
          validation={{ required: true }}
        />
      </Row>

      { dataSource &&
        <Group>
          <Row id={getFieldId(`${fieldId}.cardOptions.displayLabel`)} data-name="Prompt Display Label">
            <h3>Display Label</h3>
            <ValidatedField
              component={Select}
              name={`${fieldId}.cardOptions.displayLabel`}
              id="displayLabel"
              options={externalDataPropertyOptions}
              validation={{ required: true }}
            />
          </Row>

          { displayLabel &&
            <Row
              id={getFieldId(`${fieldId}.cardOptions.additionalProperties`)}
              data-name="Additional Display Properties"
            >
              <h3>Additional Display Properties</h3>
              <MultiSelect
                name={`${fieldId}.cardOptions.additionalProperties`}
                maxItems={externalDataPropertyOptions.length - 1}
                properties={[
                  {
                    fieldName: 'variable',
                  },
                  {
                    fieldName: 'label',
                    component: Fields.Text,
                    placeholder: '',
                  },
                ]}
                options={additionalPropertiesOptions}
              />
            </Row>
          }
        </Group>
      }

      { dataSource &&
        <Group>
          <Row
            id={getFieldId(`${fieldId}.searchOptions.fuzziness`)}
            data-name="Prompt Search Fuzziness"
          >
            <h3>Fuzziness</h3>
            <Field
              name={`${fieldId}.searchOptions.fuzziness`}
              component={Fields.Number}
              min="0"
              max="1"
              step="0.1"
            />
          </Row>
          <Row
            id={getFieldId(`${fieldId}.searchOptions.matchProperties`)}
            data-name="Prompt Search Match Properties"
          >
            <h3>Match Properties</h3>
            <Field
              name={`${fieldId}.searchOptions.matchProperties`}
              component={Fields.CheckboxGroup}
              options={externalDataPropertyOptions}
            />
          </Row>
        </Group>
      }
    </Item>
  );
};

NameGeneratorAutoCompletePrompt.propTypes = {
  fieldId: PropTypes.string.isRequired,
  form: PropTypes.shape({
    name: PropTypes.string,
    getValues: PropTypes.func,
  }).isRequired,
  nodeType: PropTypes.string,
  dataSources: PropTypes.array,
  externalDataPropertyOptions: [],
};

NameGeneratorAutoCompletePrompt.defaultProps = {
  nodeType: null,
  dataSources: [],
  externalDataPropertyOptions: [],
};

const mapStateToProps = (state, { fieldId, form, nodeType }) => {
  if (!nodeType) { return {}; }

  const { dataSource, cardOptions } = form.getValues(state, fieldId);
  const displayLabel = cardOptions && cardOptions.displayLabel;
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
    dataSource,
    displayLabel,
    externalDataPropertyOptions,
  };
};

export { NameGeneratorAutoCompletePrompt };

export default connect(mapStateToProps)(NameGeneratorAutoCompletePrompt);
