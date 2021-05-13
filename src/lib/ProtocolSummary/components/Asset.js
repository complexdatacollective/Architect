import React, { useContext } from 'react';
import { get } from 'lodash';
import SummaryContext from './SummaryContext';
import DualLink from './DualLink';
import MiniTable from './MiniTable';

const Asset = ({
  id,
  link,
}) => {
  const {
    protocol: { assetManifest },
  } = useContext(SummaryContext);

  const data = get(assetManifest, id);

  if (!data) { return `Asset ${id} not found`; }

  const asset = (
    <>
      <div className="protocol-summary-asset__icon">
        <MiniTable
          rows={[
            [<strong>Type</strong>, data.type],
            [<strong>Name</strong>, data.name],
          ]}
        />
      </div>
    </>
  );

  if (!link) {
    return (
      <div className="protocol-summary-asset">
        {asset}
      </div>
    );
  }

  return (
    <DualLink
      to={`#asset-${id}`}
      className="protocol-summary-asset"
    >
      {asset}
    </DualLink>
  );
};

export default Asset;
