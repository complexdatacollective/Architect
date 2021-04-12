import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import ValidatedField from '@components/Form/ValidatedField';
import withDisabledAssetRequired from '@components/enhancers/withDisabledAssetRequired';
import withMapFormToProps from '@components/enhancers/withMapFormToProps';
import useVariablesFromExternalData from '@hooks/useVariablesFromExternalData';
import Tip from '../Tip';

const SearchOptions = ({
  dataSource,
  disabled,
}) => {
  const { variables: variableOptions } = useVariablesFromExternalData(dataSource, true);

  return (
    <Section group disabled={disabled}>
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
        <Tip>
          <p>
            If the roster contains many similar nodes, selecting
            &quot;Exact&quot; or &quot;High accuracy&quot; will help narrow down
            searches. In contrast, a low accuracy search will allow
            for typos and spelling mistakes.
          </p>
        </Tip>
        <ValidatedField
          name="searchOptions.fuzziness"
          component={Fields.RadioGroup}
          options={[
            { value: 0, label: 'Exact' },
            { value: 0.25, label: 'High accuracy' },
            { value: 0.5, label: 'Medium accuracy' },
            { value: 0.75, label: 'Low accuracy' },
          ]}
          validation={{ requiredAcceptsZero: true }}
        />
      </Row>
    </Section>
  );
};

SearchOptions.propTypes = {
  dataSource: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export { SearchOptions };

export default compose(
  withMapFormToProps(['dataSource']),
  withDisabledAssetRequired,
)(SearchOptions);
