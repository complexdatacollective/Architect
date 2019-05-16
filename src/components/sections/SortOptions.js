import React from 'react';
import { compose } from 'recompose';
import MultiSelect from '../Form/MultiSelect';
import withDisabledAssetRequired from '../enhancers/withDisabledAssetRequired';
import { Text } from '../../ui/components/Fields';
import Section from './Section';
import Row from './Row';
import withDataSource from '../enhancers/withDataSource';
import withFieldValues from './NameGeneratorListPrompts/withFieldValues';
import withExternalDataPropertyOptions from './NameGeneratorListPrompts/withExternalDataPropertyOptions';
import getSortOrderOptionGetter from './NameGeneratorListPrompts/getSortOrderOptionGetter';
import getExternalPropertiesOptionGetter from './NameGeneratorListPrompts/getExternalPropertiesOptionGetter';

const SortOptions = ({
  maxAdditionalDisplayProperties,
  additionalPropertiesOptionGetter,
  variableOptions,
  ...props
}) => {
  const sortOrderOptionGetter = getSortOrderOptionGetter(variableOptions);
  const sortablePropertiesOptionGetter = getExternalPropertiesOptionGetter(variableOptions);
  return (
    <Section group contentId="guidance.editor.SortOptions" {...props}>
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
  );
};

export { SortOptions };

export default compose(
  withDataSource,
  withDisabledAssetRequired,
  withFieldValues(['dataSource']),
  withExternalDataPropertyOptions,
)(SortOptions);

