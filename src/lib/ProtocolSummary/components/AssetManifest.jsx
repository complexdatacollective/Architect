import React, { useContext } from 'react';
import {
  map, toPairs, groupBy, isEmpty,
} from 'lodash';
import SummaryContext from './SummaryContext';
import Asset from './Asset';

const AssetManifest = () => {
  const {
    protocol: { assetManifest },
  } = useContext(SummaryContext);

  if (!assetManifest) { return null; }

  const assets = groupBy(
    toPairs(assetManifest),
    ([, asset]) => asset.type,
  );

  if (isEmpty(assets)) {
    return null;
  }

  return (
    <div className="protocol-summary-asset-manifest page-break-marker">
      <h1>Resource Library</h1>
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
