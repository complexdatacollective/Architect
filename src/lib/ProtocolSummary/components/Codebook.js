import React, { useContext } from 'react';
import { toPairs } from 'lodash';
import SummaryContext from './SummaryContext';
import Entity from './Entity';

const Codebook = () => {
  const {
    protocol: { codebook },
  } = useContext(SummaryContext);

  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);

  return (
    <div>
      <h2>Codebook</h2>
      { codebook.ego && (
        <Entity
          isEgo
          entity={codebook.ego}
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
          />
        ),
      )}
    </div>
  );
};

export default Codebook;
