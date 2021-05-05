import React from 'react';
import { toPairs } from 'lodash';
import Entity from './Entity';

const Codebook = ({ codebook, index }) => {
  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);

  return (
    <div>
      <h2>Codebook</h2>
      { codebook.ego && (
        <Entity
          isEgo
          entity={codebook.ego}
          index={index}
        />
      )}
      {nodes.map(
        ([id, node]) => (
          <Entity
            isNode
            id={id}
            color={node.color}
            iconVariant={node.iconVariant}
            name={node.name}
            variables={node.variables}
            codebook={codebook}
            index={index}
          />
        ),
      )}
      {edges.map(
        ([id, edge]) => (
          <Entity
            isNode
            id={id}
            color={edge.color}
            iconVariant={edge.iconVariant}
            name={edge.name}
            variables={edge.variables}
            codebook={codebook}
            index={index}
          />
        ),
      )}
    </div>
  );
};

export default Codebook;
