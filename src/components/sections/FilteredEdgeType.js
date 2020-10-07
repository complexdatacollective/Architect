import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const FilteredEdgeType = props => (
  <Section className="stage-heading">
    <Row>
      <EdgeTypeFields {...props} />
    </Row>
    <NetworkFilter {...props} title="Enable edge filtering for this stage" />
  </Section>
);

export default FilteredEdgeType;

