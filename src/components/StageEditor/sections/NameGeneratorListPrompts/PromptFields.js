import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { Field } from 'redux-form';
import { ValidatedField } from '../../../Form';
import { TextArea, Text, Checkbox } from '../../../../ui/components/Fields';
import Select from '../../../Form/Fields/Select';
import MultiSelect from '../../../Form/MultiSelect';
import AttributesTable from '../../../AttributesTable';
import { Row, Group } from '../../../OrderedList';
import {
  getExternalPropertiesOptionGetter,
  getSortOrderOptionGetter,
} from './optionGetters';
import withFieldValues from './withFieldValues';
import withDataSourceOptions from './withDataSourceOptions';
import withDisplayLabelChangeHandler from './withDisplayLabelChangeHandler';

class PromptFields extends PureComponent {
  render() {
    const {
      nodeType,
      dataSources,
      dataSource,
      cardOptions,
      externalDataPropertyOptions,
      handleChangeDisplayLabel,
    } = this.props;

    const displayLabel = cardOptions && cardOptions.displayLabel;

    const additionalPropertiesOptions = getExternalPropertiesOptionGetter(
      externalDataPropertyOptions.filter(({ value }) => value !== displayLabel),
    );

    return (
      <React.Fragment>
        <Row>
          <h3>Text for Prompt</h3>
          <ValidatedField
            name="text"
            component={TextArea}
            label=""
            placeholder="Enter text for the prompt here"
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3>Additional attributes</h3>
          <AttributesTable
            name="additionalAttributes"
            id="additionalAttributes"
            nodeType={nodeType}
          />
        </Row>
        <Row>
          <h3>External data-source for roster</h3>
          <p>This prompt needs a source of nodes to populate the roster.</p>
          <ValidatedField
            component={Select}
            name="dataSource"
            id="dataSource"
            options={dataSources}
            validation={{ required: true }}
          />
        </Row>
        <Row>
          <h3>Show existing nodes</h3>
          <p>
            Show nodes added from other prompts, otherwise only nodes added on this
            prompt will be shown.
          </p>
          <Field
            name="showExistingNodes"
            component={Checkbox}
            label="Show existing nodes"
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
              <h4>Display Label</h4>
              <ValidatedField
                component={Select}
                name="cardOptions.displayLabel"
                id="displayLabel"
                options={externalDataPropertyOptions}
                validation={{ required: true }}
                onChange={handleChangeDisplayLabel}
              />
            </Row>

            { displayLabel &&
              <Row>
                <h4>Additional Display Properties</h4>
                <p>
                  Would you like do display any other attributes to help identify each node?
                </p>
                <MultiSelect
                  name="cardOptions.additionalProperties"
                  maxItems={externalDataPropertyOptions.length - 1}
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
                  options={additionalPropertiesOptions}
                />
              </Row>
            }
          </Group>
        }

        { dataSource && displayLabel && // we don't need display label, but lets go step-by-step
          <Group>
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
                options={getSortOrderOptionGetter(externalDataPropertyOptions)}
              />
            </Row>
            <Row>
              <h4>Sortable Properties</h4>
              <p>
                What manual options would you like to provide for sorting nodes?
              </p>
              <MultiSelect
                name="sortOptions.sortableProperties"
                maxItems={externalDataPropertyOptions.length}
                properties={[
                  { fieldName: 'variable' },
                  {
                    fieldName: 'label',
                    component: Text,
                    placeholder: 'Label',
                  },
                ]}
                options={getExternalPropertiesOptionGetter(externalDataPropertyOptions)}
              />
            </Row>
          </Group>
        }
      </React.Fragment>
    );
  }
}

PromptFields.propTypes = {
  nodeType: PropTypes.string,
  dataSources: PropTypes.array,
  externalDataPropertyOptions: PropTypes.array,
  handleChangeDisplayLabel: PropTypes.func.isRequired,
  dataSource: PropTypes.string,
  cardOptions: PropTypes.object,
};

PromptFields.defaultProps = {
  nodeType: null,
  dataSources: [],
  dataSource: null,
  cardOptions: {},
  externalDataPropertyOptions: [],
};

export { PromptFields };

export default compose(
  withFieldValues(['dataSource', 'cardOptions']),
  withDataSourceOptions,
  withDisplayLabelChangeHandler,
)(PromptFields);
