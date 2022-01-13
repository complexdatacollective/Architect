import React from 'react';
import { Field } from 'redux-form';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';
import {
  Filter as FilterQuery, withFieldConnector, withStoreConnector, ruleValidator,
} from '../Query';

const FilterField = withFieldConnector(withStoreConnector(FilterQuery));

const Filter = () => (
  <Section
    title="Filter"
    toggleable
    summary={(
      <p>
        You can optionally filter which nodes are shown on this stage, by creating
        one or more rules using the options below.
      </p>
    )}
  >
    <div id={getFieldId('filter')} data-name="Filter text" />
    <Field
      name="filter"
      component={FilterField}
      validate={ruleValidator}
    />
  </Section>
);

export default Filter;
