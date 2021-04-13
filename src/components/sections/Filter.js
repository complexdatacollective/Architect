import React from 'react';
import { Field } from 'redux-form';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';
import {
  Filter as FilterQuery, withFieldConnector, withStoreConnector, ruleValidator,
} from '../Query';

const FilterField = withFieldConnector(withStoreConnector(FilterQuery));

const Filter = () => (
  <Section>
    <div id={getFieldId('filter')} data-name="Filter text" />
    <h2>
      Filter
      { ' ' }
      <small>(optional)</small>
    </h2>
    {/* <p>
      You can optionally filter which nodes are shown on this stage, by creating
      one or more rules using the options below.
    </p> */}
    <Field
      name="filter"
      component={FilterField}
      validate={ruleValidator}
    />
  </Section>
);

export default Filter;
