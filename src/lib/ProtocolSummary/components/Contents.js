import React, { useContext } from 'react';
import { map, toPairs } from 'lodash';
import { HashLink } from 'react-router-hash-link';
import SummaryContext from './SummaryContext';

const Contents = () => {
  const {
    protocol: { stages, codebook },
  } = useContext(SummaryContext);

  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);

  return (
    <div>
      <h1>Contents</h1>
      <h2>Stages</h2>
      <ol>
        {stages && map(stages, ({
          label,
          id,
        }) => (
          <li>
            <HashLink smooth to={`#stage-${id}`} data-print="no">{label}</HashLink>
            <a href={`#stage-${id}`} data-print="only">{label}</a>
          </li>
        ))}
      </ol>
      <h2>Entities</h2>
      {codebook.ego && (
        <div>
          <h3>Ego</h3>
          <ul>
            <li>
              <HashLink smooth to="#ego" data-print="no">ego</HashLink>
              <a href="#ego" data-print="only">ego</a>
            </li>
          </ul>
        </div>
      )}
      <h3>Nodes</h3>
      <ul>
        {nodes.map(([id, node]) => (
          <li>
            <HashLink smooth to={`#entity-${id}`} data-print="no">{node.name}</HashLink>
            <a href={`#entity-${id}`} data-print="only">{node.name}</a>
          </li>
        ))}
      </ul>
      <h3>Edges</h3>
      <ul>
        {edges.map(([id, edge]) => (
          <li>
            <HashLink smooth to={`#entity-${id}`} data-print="no">{edge.name}</HashLink>
            <a href={`#entity-${id}`} data-print="only">{edge.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Contents;
