import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import NodeTypeFields from '@components/sections/fields/NodeTypeFields';

const FilteredNodeType = props => (
  <Section>
    <Row>
      <NodeTypeFields {...props} />
    </Row>
    <NetworkFilter {...props} title="Enable node filtering for this stage" />
  </Section>
);

export default FilteredNodeType;

