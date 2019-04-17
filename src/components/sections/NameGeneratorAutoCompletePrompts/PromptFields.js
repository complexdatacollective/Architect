import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { getFieldId } from '../../../utils/issues';
import ValidatedField from '../../Form/ValidatedField';
import * as Fields from '../../../ui/components/Fields';
import Button from '../../../ui/components/Button';
import DataSource from '../../Form/Fields/DataSource';
import Select from '../../Form/Fields/Select';
import MultiSelect from '../../Form/MultiSelect';
import AssignAttributes from '../../AssignAttributes';
import { Row, Group } from '../../OrderedList';
import withNewVariableWindowHandlers, {
  propTypes as newVariableWindowPropTypes,
} from '../../enhancers/withNewVariableWindowHandlers';
import NewVariableWindow from '../../NewVariableWindow';
import {
  withFieldValues,
} from '../NameGeneratorListPrompts';
import withDisplayLabelChangeHandler from '../NameGeneratorListPrompts/withDisplayLabelChangeHandler';
import withExternalDataPropertyOptions, {
  displayLabelTypes,
  propTypes as externalDataPropTypes,
} from '../NameGeneratorListPrompts/withExternalDataPropertyOptions';
import withNewVariableHandlers from './withNewVariableHandlers';

const PromptFields = ({
  dataSource,
  displayLabel,
  displayLabelOptions,
  additionalPropertiesOptionGetter,
  maxAdditionalDisplayProperties,
  handleChangeDisplayLabel,
  handleCreateNewSearchVariable,
  form,
  entity,
  type,
  openNewVariableWindow,
  closeNewVariableWindow,
  showNewVariableWindow,
}) => (
  <React.Fragment>
    <Row>
      <h3 id={getFieldId('text')}>Text for Prompt</h3>
      <ValidatedField
        name="text"
        component={Fields.TextArea}
        label=""
        placeholder="Enter text for the prompt here"
        validation={{ required: true }}
      />
    </Row>
    <Row>
      <h3>Assign attributes</h3>
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
        id="dataSource"
        validation={{ required: true }}
      />
    </Row>

    { dataSource &&
      <Group>
        <Row>
          <h3>Card options</h3>
          <p>
            How would you like to the search results to be displayed?
          </p>
        </Row>
        <Row>
          <div id={getFieldId('cardOptions.displayLabel')} data-name="Card display label" />
          <h4>Display Label</h4>
          <p>Which property should be used to uniquely identify each node?</p>
          <ValidatedField
            component={Select}
            name="cardOptions.displayLabel"
            id="displayLabel"
            options={displayLabelOptions}
            validation={{ required: true }}
            onChange={handleChangeDisplayLabel}
          />
        </Row>

        { displayLabel && maxAdditionalDisplayProperties > 0 &&
          <Row>
            <h4>Additional Display Properties</h4>
            <p>
              Would you like do display any other attributes to help identify each node?
            </p>
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
          </Row>
        }
      </Group>
    }

    { dataSource &&
      <Group>
        <Row>
          <h3>Search options</h3>
          <p>
            Which properties would you like to make searchable?
          </p>
        </Row>
        <Row>
          <h4>Search Properties</h4>
          <p>When the participant searches, which properties should be searched?</p>
          <Field
            name="searchOptions.matchProperties"
            component={Fields.CheckboxGroup}
            options={displayLabelOptions}
          />
          <Button
            color="primary"
            icon="add"
            size="small"
            style={{ margin: '1rem 0 0 0' }}
            onClick={openNewVariableWindow}
          >
            Create new variable
          </Button>
        </Row>
        <Row>
          <h4>Search Accuracy</h4>
          <p>How accurate does a query need to be when searching?</p>
          <p>
            If the roster contains many similar nodes, you might want to help narrow down
            searches by selecting &quot;Exact&quot; or high accuracy.
          </p>
          <p>
            A low accuracy search will allow for typos and spelling mistakes.
          </p>
          <Field
            name="searchOptions.fuzziness"
            component={Fields.RadioGroup}
            options={[
              { value: 0, label: 'Exact' },
              { value: 0.25, label: 'High accuracy' },
              { value: 0.5, label: 'Medium accurary' },
              { value: 0.75, label: 'Low accuracy' },
            ]}
          />
        </Row>
      </Group>
    }

    <NewVariableWindow
      show={showNewVariableWindow}
      entity={entity}
      type={type}
      allowVariableTypes={displayLabelTypes}
      onComplete={handleCreateNewSearchVariable}
      onCancel={closeNewVariableWindow}
    />
  </React.Fragment>
);

PromptFields.propTypes = {
  type: PropTypes.string,
  entity: PropTypes.string,
  dataSource: PropTypes.string,
  cardOptions: PropTypes.object,
  form: PropTypes.string.isRequired,
  handleChangeDisplayLabel: PropTypes.func.isRequired,
  ...externalDataPropTypes,
  ...newVariableWindowPropTypes,
};

PromptFields.defaultProps = {
  type: null,
  entity: null,
  dataSource: null,
  cardOptions: {},
};

export { PromptFields };

export default compose(
  withFieldValues(['dataSource', 'cardOptions']),
  withExternalDataPropertyOptions,
  withNewVariableWindowHandlers,
  withNewVariableHandlers,
  withDisplayLabelChangeHandler,
)(PromptFields);
