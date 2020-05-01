import React from 'react';
import Section from '@components/sections/Section';
import EdgeTypeFields from '@components/sections/EdgeTypeFields';

const FilteredEdgeType = props => (
  <Section>
    <EdgeTypeFields {...props} />
  </Section>
);

export default FilteredEdgeType;

