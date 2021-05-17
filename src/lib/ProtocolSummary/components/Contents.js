import React, { useContext } from 'react';
import { map, toPairs, groupBy } from 'lodash';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';
import EntityBadge from './EntityBadge';

const Contents = () => {
  const {
    protocol: { stages, codebook, assetManifest },
  } = useContext(SummaryContext);

  const nodes = toPairs(codebook.node);
  const edges = toPairs(codebook.edge);
  const assets = groupBy(
    toPairs(assetManifest),
    ([, asset]) => asset.type,
  );

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
            <li key={id}>
              <DualLink to={`#stage-${id}`}>{label}</DualLink>
            </li>
          ))}
        </ol>
      </div>
      <div className="protocol-summary-contents__section">
        <h2>Codebook</h2>
        <div className="protocol-summary-contents__subsection">
          {codebook.ego && (
            <div>
              <p>
                <DualLink to="#ego">ego</DualLink>
              </p>
            </div>
          )}
          <h4>Node types</h4>
          <div className="protocol-summary-contents__subsection">
            {nodes.map(([id]) => (
              <p key={id}>
                <EntityBadge type={id} entity="node" link small />
              </p>
            ))}
          </div>
          <h4>Edge types</h4>
          <div className="protocol-summary-contents__subsection">
            {edges.map(([id]) => (
              <p key={id}>
                <EntityBadge type={id} entity="edge" link small />
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="protocol-summary-contents__section">
        <h2>Assets</h2>
        <div className="protocol-summary-contents__subsection">
          {assets && map(assets, (typeAssets, type) => (
            <>
              <h4>{type}</h4>
              <div className="protocol-summary-contents__subsection">
                {typeAssets.map(([id, asset]) => (
                  <p>
                    <DualLink to={`#asset-${id}`}>{asset.name}</DualLink>
                  </p>
                ))}
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contents;
