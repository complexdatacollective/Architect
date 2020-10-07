import React from 'react';
import { Section } from '@components/EditorLayout';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const EdgeType = props => (
  <Section className="stage-heading">
    <EdgeTypeFields {...props} />
  </Section>
);

export default EdgeType;

