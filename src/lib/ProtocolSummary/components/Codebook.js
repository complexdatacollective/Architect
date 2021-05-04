import React from 'react';
import { toPairs } from 'lodash';
import Entity from './Entity';

const Codebook = ({ stages, codebook }) => {
  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);

  return (
    <div>
      <h2>Codebook</h2>
      <Entity isEgo entity={codebook.ego} stages={stages} />
      {nodes.map(
        (node) => (
          <Entity
            isNode
            stages={stages}
            color={node.color}
            iconVariant={node.iconVariant}
            name={node.name}
            variables={node.variables}
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
          />
        ),
      )}
    </div>
  );
};
