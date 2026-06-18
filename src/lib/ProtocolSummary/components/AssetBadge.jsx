import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useContext } from 'react';

import DualLink from './DualLink';
import MiniTable from './MiniTable';
import SummaryContext from './SummaryContext';

const AssetBadge = ({ id, link }) => {
  const {
    protocol: { assetManifest },
  } = useContext(SummaryContext);

  const data = get(assetManifest, id);

  if (!data) {
    return `Asset ${id} not found`;
  }

  const name = !link ? (
    data.name
  ) : (
    <DualLink to={`#asset-${id}`}>{data.name}</DualLink>
  );

  return (
    <div className="protocol-summary-asset-badge">
      <div className="protocol-summary-asset-badge__content">
        <MiniTable
          rotated
          rows={[
            ['Type', data.type],
            ['Name', name],
          ]}
        />
      </div>
    </div>
  );
};

AssetBadge.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.bool,
};

AssetBadge.defaultProps = {
  link: false,
};

export default AssetBadge;
