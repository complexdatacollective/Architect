import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import NetworkFilter from '@components/sections/fields/NetworkFilter';
import NodeType from './NodeType';

const FilteredNodeType = (props) => (
  <Section title="Node Type">
    <Row>
      <NodeType
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Row>
    <Section title="Filter" toggleable>
      <NetworkFilter
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </Section>
  </Section>
);

export default FilteredNodeType;
