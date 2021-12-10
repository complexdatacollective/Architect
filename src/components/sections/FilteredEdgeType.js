import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const FilteredEdgeType = (props) => (
  <Section title="Filter Items" toggleable>
    <Row>
      <EdgeTypeFields
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Row>
    <NetworkFilter
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Section>
);

export default FilteredEdgeType;
