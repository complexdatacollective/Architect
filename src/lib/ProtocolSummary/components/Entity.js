import React from 'react';
import Variables from './Variables';

const Entity = ({
  isNode,
  isEgo,
  isEdge,
  color,
  iconVariant,
  name,
  variables,
  codebook,
  index,
}) => (
  <div>
    {!isEgo && (
      <div>
        <div>{color}</div>
        <div>{name}</div>
      </div>
    )}

    {isEgo && (
      <div>
        Ego
      </div>
    )}

    { isNode && 'NODE' }
    { isEgo && 'EGO' }
    { isEdge && 'EDGE' }

    <Variables
      codebook={codebook}
      variables={variables}
      index={index}
    />
  </div>
);

export default Entity;
