import React from 'react';
import Section from '@components/sections/Section';
import Row from '@components/sections/Row';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import NodeTypeFields from '@components/sections/fields/NodeTypeFields';

const FilteredNodeType = props => (
  <Section>
    <Row>
      <NodeTypeFields {...props} />
    </Row>
    <NetworkFilter {...props} />
  </Section>
);

export default FilteredNodeType;

