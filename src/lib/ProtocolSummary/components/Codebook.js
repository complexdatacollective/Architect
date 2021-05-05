import React from 'react';
import { toPairs } from 'lodash';
import Entity from './Entity';

const Codebook = ({ codebook }) => {
  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);

  return (
    <div>
      <h2>Codebook</h2>
      { codebook.ego && (
        <Entity
          isEgo
          entity={codebook.ego}
          stages={stages}
          codebook={codebook}
        />
      )}
      {nodes.map(
        (node) => (
          <Entity
            isNode
            stages={stages}
            color={node.color}
            iconVariant={node.iconVariant}
            name={node.name}
            variables={node.variables}
            codebook={codebook}
          />
        ),
      )}
      {edges.map(
        (edge) => (
          <Entity
            isNode
            stages={stages}
            color={edge.color}
            iconVariant={edge.iconVariant}
            name={edge.name}
            variables={edge.variables}
            codebook={codebook}
          />
        ),
      )}
    </div>
  );
};

export default Codebook;
