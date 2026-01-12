import React, { useContext } from 'react';
import {
  map, toPairs, groupBy, isEmpty,
} from 'lodash';
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
        <ol>
          <li>Stages</li>
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
          <li>Codebook</li>
          <ul>
            {codebook.ego && (
              <li>
                <DualLink to="#ego">Ego</DualLink>
              </li>
            )}
            <li className="heading">Node types</li>
            <ul>
              {nodes.map(([id]) => (
                <li key={id}>
                  <EntityBadge type={id} entity="node" link small />
                </li>
              ))}
            </ul>
            { !isEmpty(edges) && (
              <>
                <li className="heading">Edge types</li>
                <ul>
                  {edges.map(([id]) => (
                    <li key={id}>
                      <EntityBadge type={id} entity="edge" link small />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </ul>
          { !isEmpty(assets) && (
            <>
              <li>Assets</li>
              <ul>
                {assets && map(assets, (typeAssets, type) => (
                  <React.Fragment key={type}>
                    <li className="heading">
                      {type}
                    </li>
                    <ul>
                      {typeAssets.map(([id, asset]) => (
                        <li key={id}>
                          <DualLink to={`#asset-${id}`}>{asset.name}</DualLink>
                        </li>
                      ))}
                    </ul>
                  </React.Fragment>
                ))}
              </ul>
            </>
          )}
        </ol>
      </div>
    </div>
  );
};

export default Contents;
