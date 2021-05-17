import React, { useContext } from 'react';
import { map, toPairs, groupBy } from 'lodash';
import SummaryContext from './SummaryContext';
import Asset from './Asset';

const AssetManifest = () => {
  const {
    protocol: { assetManifest, },
  } = useContext(SummaryContext);

  if (!assetManifest) { return null; }

  const assets = groupBy(
    toPairs(assetManifest),
    ([, asset]) => asset.type,
  );

  return (
    <div className="protocol-summary-asset-manifest">
      <h1>Asset Manifest</h1>
      {assets && map(assets, (typeAssets, type) => (
        <div className="protocol-summary-asset-manifest__group" key={type}>
          <h2>{type}</h2>
          {typeAssets.map(([id]) => (
            <Asset id={id} key={id} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AssetManifest;
