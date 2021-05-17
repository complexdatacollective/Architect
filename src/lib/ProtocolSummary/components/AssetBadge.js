import React, { useContext } from 'react';
import { get } from 'lodash';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';
import MiniTable from './MiniTable';

const AssetBadge = ({
  id,
  link,
}) => {
  const {
    protocol: { assetManifest },
  } = useContext(SummaryContext);

  const data = get(assetManifest, id);

  if (!data) { return `Asset ${id} not found`; }

  const name = !link
    ? data.name
    : <DualLink to={`#asset-${id}`}>{data.name}</DualLink>;

  return (
    <div className="protocol-summary-asset-badge">
      <div className="protocol-summary-asset-badge__content">
        <MiniTable
          rows={[
            [<strong>Type</strong>, data.type],
            [<strong>Name</strong>, name],
          ]}
        />
      </div>
    </div>
  );
};

export default AssetBadge;
