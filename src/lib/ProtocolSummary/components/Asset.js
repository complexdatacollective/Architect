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

  const {
    name,
    type,
  } = get(assetManifest, id);

  const asset = (
    <>
      <div className="protocol-summary-asset__icon">
        <MiniTable
          rows={[
            [<strong>Type</strong>, type],
            [<strong>Name</strong>, name],
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
