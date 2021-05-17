import React, { useContext } from 'react';
import SummaryContext from './SummaryContext';
import Asset from './Asset';

const AssetManifest = () => {
  const {
    protocol: { assetManifest, },
  } = useContext(SummaryContext);

  if (!assetManifest) { return null; }

  const assets = Object.keys(assetManifest);

  return (
    <div className="protocol-summary-asset-manifest">
      <h1>Asset Manifest</h1>
      {assets.map((id) => (
        <Asset id={id} />
      ))}
    </div>
  );
};

export default AssetManifest;
