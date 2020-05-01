import React from 'react';
import Section from '@components/sections/Section';
import NetworkFilter from '@components/sections/NetworkFilter';
import EdgeTypeFields from '@components/sections/EdgeTypeFields';

const FilteredEdgeType = props => (
  <Section>
    <EdgeTypeFields {...props} />
    <NetworkFilter {...props} />
  </Section>
);

export default FilteredEdgeType;

