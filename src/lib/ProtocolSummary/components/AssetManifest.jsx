import { groupBy, isEmpty, map, toPairs } from 'lodash';
import { useContext } from 'react';

import Asset from './Asset';
import SummaryContext from './SummaryContext';

const AssetManifest = () => {
  const {
    protocol: { assetManifest },
  } = useContext(SummaryContext);

  if (!assetManifest) {
    return null;
  }

  const assets = groupBy(toPairs(assetManifest), ([, asset]) => asset.type);

  if (isEmpty(assets)) {
    return null;
  }

  return (
    <div className="protocol-summary-asset-manifest page-break-marker">
      <h1>Resource Library</h1>
      {assets &&
        map(assets, (typeAssets, type) => (
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
