import React from 'react';
import NodeTypeFields from '@components/sections/fields/NodeTypeFields';
import Section from '../EditorLayout/Section';

const NodeType = (props) => (
  <Section
    title="Node Type"
    summary={(
      <p>Select the type of node you wish to use with this stage.</p>
    )}
    // disabled={disabled}
  >
    <NodeTypeFields
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  </Section>
);

export default NodeType;
