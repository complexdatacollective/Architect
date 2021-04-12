import React from 'react';
import { Section } from '@components/EditorLayout';
import NodeTypeFields from '@components/sections/fields/NodeTypeFields';

const NodeType = (props) => (
  <Section>
    <NodeTypeFields
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Section>
);

export default NodeType;
