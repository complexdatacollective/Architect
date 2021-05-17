import React from 'react';
import PropTypes from 'prop-types';
import AssetBadge from '../AssetBadge';

const DataSource = ({ dataSource }) => {
  if (!dataSource) { return null; }

  return (
    <div className="protocol-summary-stage__data-source">
      <h2>DataSource</h2>
      <div className="protocol-summary-stage__data-source-content">
        <AssetBadge id={dataSource} link />
      </div>
    </div>
  );
};

DataSource.propTypes = {
  // dataSource:
};

DataSource.defaultProps = {
  dataSource: null,
};

export default DataSource;
