import React from 'react';
import NodeTypeFields from '@components/sections/fields/NodeTypeFields';

const NodeType = (props) => (
  <NodeTypeFields
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export default NodeType;
