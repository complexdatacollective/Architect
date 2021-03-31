import React from 'react';
import { Section } from '@components/EditorLayout';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const EdgeType = (props) => (
  <Section>
    <EdgeTypeFields
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Section>
);

export default EdgeType;
