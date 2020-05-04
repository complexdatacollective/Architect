import React from 'react';
import Section from '@components/sections/Section';
import Row from '@components/sections/Row';
import NetworkFilter from '@components/sections/NetworkFilter';
import EdgeTypeFields from '@components/sections/EdgeTypeFields';

const FilteredEdgeType = props => (
  <Section>
    <Row>
      <EdgeTypeFields {...props} />
    </Row>
    <NetworkFilter {...props} />
  </Section>
);

export default FilteredEdgeType;

