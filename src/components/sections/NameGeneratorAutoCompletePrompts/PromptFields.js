import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { getFieldId } from '../../../utils/issues';
import ValidatedField from '../../Form/ValidatedField';
import * as Fields from '../../../ui/components/Fields';
import DataSource from '../../Form/Fields/DataSource';
import MultiSelect from '../../Form/MultiSelect';
import AssignAttributes from '../../AssignAttributes';
import withFieldValues from '../NameGeneratorListPrompts/withFieldValues';
import withExternalDataPropertyOptions, { propTypes as externalDataPropTypes } from '../NameGeneratorListPrompts/withExternalDataPropertyOptions';
import Row from '../Row';
import Section from '../Section';

const PromptFields = ({
  dataSource,
  variableOptions,
  additionalPropertiesOptionGetter,
  maxAdditionalDisplayProperties,
  form,
  entity,
  type,
}) => (
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
        component={Fields.Text}
        label=""
        placeholder="Enter text for the prompt here"
        validation={{ required: true, maxLength: 220 }}
      />
    </Row>
    <Row>
      <h3>Assign Additional Variables? <small>(optional)</small></h3>
      <p>
        You might also wish to assign additional variables to any nodes that are created by a
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
        id="dataSource"
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
                  component: Fields.Text,
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
          <h3>Search Options</h3>
          <p>
            To find and select nodes from the roster, the participant will use a search function.
            This section controls how this search function works on this stage.
          </p>
        </Row>
        <Row>
          <h4>Searchable Properties</h4>
          <p>Which attributes in your data file should be searchable? Select one or more.</p>
          <ValidatedField
            name="searchOptions.matchProperties"
            component={Fields.CheckboxGroup}
            options={variableOptions}
            validation={{ minSelected: 1 }}
          />
        </Row>
        <Row>
          <h4>Search Accuracy</h4>
          <p>
            Search accuracy determines how closely the text the participant types
            must be to an attribute for it to be considered a match.
          </p>
          <p>
            <strong>
              Tip: If the roster contains many similar nodes, selecting
              &quot;Exact&quot; or &quot;High accuracy&quot; will help narrow down
              searches. In contrast, a low accuracy search will allow
              for typos and spelling mistakes.
            </strong>
          </p>
          <ValidatedField
            name="searchOptions.fuzziness"
            component={Fields.RadioGroup}
            options={[
              { value: 0, label: 'Exact' },
              { value: 0.25, label: 'High accuracy' },
              { value: 0.5, label: 'Medium accurary' },
              { value: 0.75, label: 'Low accuracy' },
            ]}
            validation={{ required: true }}
          />
        </Row>
      </Section>
    }
  </Section>
);

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
