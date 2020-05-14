import React from 'react';
import { compose } from 'recompose';
import PropTypes from 'prop-types';
import { Text } from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import MultiSelect from '../../Form/MultiSelect';
import withMapFormToProps from '../../enhancers/withMapFormToProps';
import withExternalData from '../../enhancers/withExternalData';
import withDisabledAssetRequired from '../../enhancers/withDisabledAssetRequired';
import variableOptionsFromExternalData from '../../enhancers/withVariableOptionsFromExternalData';
import getSortOrderOptionGetter from './getSortOrderOptionGetter';
import withVariableOptionsGetter from './withVariableOptionsGetter';

const SortOptions = ({
  variableOptions,
  maxVariableOptions,
  variableOptionsGetter,
  disabled,
}) => {
  const sortOrderOptionGetter = getSortOrderOptionGetter(variableOptions);

  return (
    <Section group contentId="guidance.editor.SortOptions" disabled={disabled}>
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
          maxItems={maxVariableOptions}
          properties={[
            { fieldName: 'variable' },
            {
              fieldName: 'label',
              component: Text,
              placeholder: 'Label',
            },
          ]}
          options={variableOptionsGetter}
        />
      </Row>
    </Section>
  );
};

SortOptions.propTypes = {
  variableOptions: PropTypes.array.isRequired,
  maxVariableOptions: PropTypes.number.isRequired,
  variableOptionsGetter: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export { SortOptions };

export default compose(
  withMapFormToProps('dataSource'),
  withDisabledAssetRequired,
  withExternalData,
  variableOptionsFromExternalData,
  withVariableOptionsGetter,
)(SortOptions);

