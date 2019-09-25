import React from 'react';
import { Field } from 'redux-form';
import { getFieldId } from '../../utils/issues';
import { Filter as FilterQuery, withFieldConnector, withStoreConnector } from '../Query';
import Section from './Section';

const FilterField = withFieldConnector(withStoreConnector(FilterQuery));

const Filter = () => (
  <Section contentId="guidance.editor.filter">
    <div id={getFieldId('filter')} data-name="Filter text" />
    <h2>Filter <small>(optional)</small></h2>
    <p>
      You can optionally filter which nodes are shown on this stage, by creating
      one or more rules using the options below.
    </p>
    <Field
      name="filter"
      component={FilterField}
    />
  </Section>
);

export default Filter;
