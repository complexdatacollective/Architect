import React from 'react';
import { Section } from '@components/EditorLayout';
import EdgeTypeFields from '@components/sections/fields/EdgeTypeFields';

const EdgeType = (props) => (
  <Section
    title="Edge Type"
    summary={(
      <p>Select the type of edge you want to use with this stage.</p>
    )}
  >
    <EdgeTypeFields
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Section>
);

export default EdgeType;
