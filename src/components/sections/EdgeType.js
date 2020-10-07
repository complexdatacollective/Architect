import React from 'react';
import { Section } from '@components/EditorLayout';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const EdgeType = props => (
  <Section>
    <EdgeTypeFields {...props} />
  </Section>
);

export default EdgeType;

