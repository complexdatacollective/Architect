import React from 'react';
import Section from '@components/sections/Section';
import NetworkFilter from '@components/sections/NetworkFilter';
import NodeTypeFields from '@components/sections/NodeTypeFields';

const FilteredNodeType = props => (
  <Section>
    <NodeTypeFields {...props} />
    <NetworkFilter {...props} />
  </Section>
);

export default FilteredNodeType;

