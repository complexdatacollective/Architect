import React from 'react';
import { compose } from 'recompose';
import * as Fields from '../../ui/components/Fields';
import ValidatedField from '../Form/ValidatedField';
import withDisabledAssetRequired from '../enhancers/withDisabledAssetRequired';
import withMapFormToProps from '../enhancers/withMapFormToProps';
import withExternalData from '../enhancers/withExternalData';
import Section from './Section';
import Row from './Row';
import withExternalDataPropertyOptions from './SortOptionsForExternalData/withExternalDataPropertyOptions';

const SearchOptions = ({
  maxAdditionalDisplayProperties,
  additionalPropertiesOptionGetter,
  variableOptions,
  ...props
}) => (
  <Section group contentId="guidance.editor.SearchOptions" {...props}>
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
);

export { SearchOptions };

export default compose(
  withMapFormToProps(['dataSource']),
  withDisabledAssetRequired,
  withExternalData,
  withExternalDataPropertyOptions,
)(SearchOptions);

