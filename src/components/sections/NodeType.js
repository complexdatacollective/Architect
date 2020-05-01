import React from 'react';
import Section from '@components/sections/Section';
import NodeTypeFields from '@components/sections/NodeTypeFields';

const FilteredNodeType = props => (
  <Section>
    <NodeTypeFields {...props} />
  </Section>
);

export default FilteredNodeType;

