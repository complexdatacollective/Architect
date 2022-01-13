import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';
import Filter from './Filter';

const FilteredEdgeType = (props) => (
  <Section title="Edge Type">
    <Row>
      <EdgeTypeFields
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Row>
    <Filter
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Section>
);

export default FilteredEdgeType;
