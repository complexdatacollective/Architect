import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import ValidatedField from '../../Form/ValidatedField';
import { Text } from '../../../ui/components/Fields';
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
        <h3 id={getFieldId('text')}>Prompt Text</h3>
        <p>
          The prompt text instructs your participant about the task on this stage.
          Enter the text to use for your prompt below.
        </p>
        <p><strong>
          Tip: You can use markdown formatting in this prompt to create bold or underlined text.
        </strong></p>
        <ValidatedField
          name="text"
          component={Text}
          label=""
          placeholder="Enter text for the prompt here"
          validation={{ required: true, maxLength: 220 }}
        />
      </Row>
      <Row>
        <h3>Assign Additional Variables? <small>(optional)</small></h3>
        <p>
          You can assign additional variables to any nodes that are created by a
          participant on this prompt. You can use this feature to keep track of meta-data,
          such as where a node was elicited, or to reflect a name interpreter element of
          your prompt (for example by adding a variable called &quot;close_tie&quot; to a
          prompt that asks about closeness).
        </p>
        <p>
          <strong>Tip: Select an existing variable, or select &quot;create new variable&quot;
          from the bottom of the list, and then assign a value. You can set different values
          for this variable for nodes created on different prompts.</strong>
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
        <h3>External Data-source for Roster</h3>
        <p>
          This prompt needs a source of nodes to populate the roster.
          Select a network data file to use.
        </p>
        <ValidatedField
          component={DataSource}
          name="dataSource"
          validation={{ required: true }}
        />
      </Row>
      { dataSource &&
        <Section group>
          <Row>
            <h3>Card Display Options</h3>
            <p>
              This section controls how the cards (which represent each item in your roster
              data file) are displayed to the participant.
            </p>
            <p>
              Cards will use the <strong>name</strong> attribute from your external data as
              the main card title.
            </p>
          </Row>
          <Row>
            <h4>Additional Display Properties</h4>
            <p>
              Would you like to display any other attributes to help the participant recognize
              a roster alter?
            </p>
            { maxAdditionalDisplayProperties === 0 &&
              <p><em>
                Your external data does not seem to contain any usable attributes.
                Is it correctly formatted?
              </em></p>
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
            <h3>Sort Options</h3>
            <p>
              This section controls how the cards in the roster are sorted.
            </p>
          </Row>
          <Row>
            <h4>Initial Sort Order <small>(optional)</small></h4>
            <p>
              Create one or more rules to determine the default sort order or the roster,
              when it is first shown to the participant. By default, Network Canvas will
              use the order that nodes are defined in your data file.
            </p>
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
            <h4>Participant Sortable Properties <small>(optional)</small></h4>
            <p>
              This interface allows the participant to sort the roster, to help with locating
              a specific member. Select one or more attributes from your roster that the
              participant can use to sort the list.
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
