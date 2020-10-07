import React from 'react';
import { Section } from '@components/EditorLayout';
import NodeTypeFields from '@components/sections/fields/NodeTypeFields';

const NodeType = props => (
  <Section className="stage-heading">
    <NodeTypeFields {...props} />
  </Section>
);

export default NodeType;

