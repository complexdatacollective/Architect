import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import NodeTypeFields from './fields/NodeTypeFields';
import Filter from './Filter';

const FilteredNodeType = (props) => (
  <Section title="Node Type">
    <Row>
      <NodeTypeFields
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

export default FilteredNodeType;
