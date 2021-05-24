import React from 'react';
import PropTypes from 'prop-types';
import AssetBadge from '../AssetBadge';

const DataSource = ({ dataSource }) => {
  if (!dataSource) { return null; }

  return (
    <div className="protocol-summary-stage__data-source">
      <div className="protocol-summary-stage__data-source-content">
        <h2 className="section-heading">DataSource</h2>
        <AssetBadge id={dataSource} link />
      </div>
    </div>
  );
};

DataSource.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  dataSource: PropTypes.object,
};

DataSource.defaultProps = {
  dataSource: null,
};

export default DataSource;
