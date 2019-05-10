import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import ValidatedField from '../../Form/ValidatedField';
import { TextArea, Text } from '../../../ui/components/Fields';
import DataSource from '../../Form/Fields/DataSource';
import MultiSelect from '../../Form/MultiSelect';
import AssignAttributes from '../../AssignAttributes';
import getSortOrderOptionGetter from './getSortOrderOptionGetter';
import getExternalPropertiesOptionGetter from './getExternalPropertiesOptionGetter';
import withFieldValues from './withFieldValues';
import withExternalDataPropertyOptions, { propTypes as externalDataPropTypes } from './withExternalDataPropertyOptions';
import Row from '../Row';
import Section from '../Section';

const PromptFields = ({
  type,
  entity,
  dataSource,
  variableOptions,
  additionalPropertiesOptionGetter,
  maxAdditionalDisplayProperties,
  form,
}) => {
  const sortOrderOptionGetter = getSortOrderOptionGetter(variableOptions);
  const sortablePropertiesOptionGetter = getExternalPropertiesOptionGetter(variableOptions);

  return (
    <Section>
      <Row>
        <h3 id={getFieldId('text')}>Text for Prompt</h3>
        <ValidatedField
          name="text"
          component={TextArea}
          label=""
          placeholder="Enter text for the prompt here"
          validation={{ required: true }}
        />
      </Row>
      <Row>
        <h3>Assign additional variables <small>(optional)</small></h3>
        <p>
            You may optionally assign variable values to all nodes created on this prompt.
            Select an existing variable (and set a value), or select &quot;create new variable&quot;
            from the bottom of the list.
        </p>
        <AssignAttributes
          name="additionalAttributes"
          id="additionalAttributes"
          form={form}
          type={type}
          entity={entity}
        />
      </Row>
      <Row>
        <div id={getFieldId('dataSource')} data-name="Roster data-source" />
        <h3>External data-source for roster</h3>
        <p>This prompt needs a source of nodes to populate the roster.</p>
        <ValidatedField
          component={DataSource}
          name="dataSource"
          validation={{ required: true }}
        />
      </Row>
      { dataSource &&
        <Section group>
          <Row>
            <h3>Card options</h3>
            <p>
              How would you like to the search results to be displayed?
            </p>
            <p>
              Cards will use the <strong>label</strong> attribute from your external data as
              the main card title.
            </p>
          </Row>
          <Row>
            <h4>Additional Display Properties</h4>
            <p>
              Would you like do display any other attributes to help identify each node?
            </p>
            { maxAdditionalDisplayProperties === 0 &&
              <p><em>Your external data does not contain any usable attributes.</em></p>
            }
            { maxAdditionalDisplayProperties > 0 &&
              <MultiSelect
                name="cardOptions.additionalProperties"
                maxItems={maxAdditionalDisplayProperties}
                properties={[
                  {
                    fieldName: 'variable',
                  },
                  {
                    fieldName: 'label',
                    component: Text,
                    placeholder: 'Label',
                  },
                ]}
                options={additionalPropertiesOptionGetter}
              />
            }
          </Row>
        </Section>
      }

      { dataSource &&
        <Section group>
          <Row>
            <h3>Sort options</h3>
            <p>
              How would you like to sort the available options?
            </p>
          </Row>
          <Row>
            <h4>Default Sort Order</h4>
            <p>How would you like to sort nodes by default?</p>
            <MultiSelect
              name="sortOptions.sortOrder"
              maxItems={1}
              properties={[
                { fieldName: 'property' },
                { fieldName: 'direction' },
              ]}
              options={sortOrderOptionGetter}
            />
          </Row>
          <Row>
            <h4>Sortable Properties</h4>
            <p>
              What manual options would you like to provide for sorting nodes?
            </p>
            <MultiSelect
              name="sortOptions.sortableProperties"
              maxItems={variableOptions.length}
              properties={[
                { fieldName: 'variable' },
                {
                  fieldName: 'label',
                  component: Text,
                  placeholder: 'Label',
                },
              ]}
              options={sortablePropertiesOptionGetter}
            />
          </Row>
        </Section>
      }
    </Section>
  );
};

PromptFields.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string,
  dataSource: PropTypes.string,
  form: PropTypes.string.isRequired,
  ...externalDataPropTypes,
};

PromptFields.defaultProps = {
  type: null,
  entity: null,
  dataSource: null,
};

export { PromptFields };

export default compose(
  withFieldValues(['dataSource']),
  withExternalDataPropertyOptions,
)(PromptFields);
