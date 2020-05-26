import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const FilteredEdgeType = props => (
  <Section>
    <Row>
      <EdgeTypeFields {...props} />
    </Row>
    <NetworkFilter {...props} title="Use edge filter" />
  </Section>
);

export default FilteredEdgeType;

