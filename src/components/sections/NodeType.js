import React from 'react';
import NodeTypeFields from '@components/sections/fields/NodeTypeFields';
import Section from '../EditorLayout/Section';

const NodeType = (props) => (
  <Section
    title="Node Type"
  >
    <NodeTypeFields
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Section>
);

export default NodeType;
