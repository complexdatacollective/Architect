import React, { useContext } from 'react';
import { map, toPairs } from 'lodash';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';
import EntityBadge from './EntityBadge';

const Contents = () => {
  const {
    protocol: { stages, codebook },
  } = useContext(SummaryContext);

  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);

  return (
    <div className="protocol-summary-contents">
      <h1>Contents</h1>
      <div className="protocol-summary-contents__section">
        <h2>Stages</h2>
        <ol>
          {stages && map(stages, ({
            label,
            id,
          }) => (
            <li>
              <DualLink to={`#stage-${id}`}>{label}</DualLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="protocol-summary-contents__section">
        <h2>Codebook</h2>
        {codebook.ego && (
          <div>
            <ul>
              <li>
                <DualLink to="#ego">ego</DualLink>
              </li>
            </ul>
          </div>
        )}
        <h4>Node types</h4>
        <ul>
          {nodes.map(([id]) => (
            <li>
              <EntityBadge type={id} entity="node" showLink />
            </li>
          ))}
        </ul>
        <h4>Edge types</h4>
        <ul>
          {edges.map(([id]) => (
            <li>
              <EntityBadge type={id} entity="edge" showLink />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Contents;
