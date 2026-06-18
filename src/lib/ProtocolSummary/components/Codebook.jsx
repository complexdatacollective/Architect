import { toPairs } from 'lodash';
import { useContext } from 'react';

import Entity from './Entity';
import SummaryContext from './SummaryContext';

const Codebook = () => {
  const {
    protocol: { codebook },
  } = useContext(SummaryContext);

  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);

  return (
    <div className="landscape">
      {codebook.ego && (
        <Entity entity="ego" variables={codebook.ego.variables} />
      )}
      {nodes.map(([id, node]) => (
        <Entity
          key={id}
          entity="node"
          type={id}
          color={node.color}
          icon={node.icon}
          name={node.name}
          variables={node.variables}
        />
      ))}
      {edges.map(([id, edge]) => (
        <Entity
          key={id}
          entity="edge"
          type={id}
          color={edge.color}
          icon={edge.icon}
          name={edge.name}
          variables={edge.variables}
        />
      ))}
    </div>
  );
};

export default Codebook;
