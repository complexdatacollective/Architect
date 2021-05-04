import React from 'react';

const Entity = ({
  isNode,
  isEgo,
  isEdge,
  color,
  iconVariant,
  name,
  variables,
}) => (
  <div>
    Entity

    { isNode && 'NODE' }
    { isEgo && 'EGO' }
    { isEdge && 'EDGE' }
  </div>
);

export default Entity;
