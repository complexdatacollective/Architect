import React from 'react';
import PropTypes from 'prop-types';

const DataSource = ({ dataSource }) => {
  if (!dataSource) { return null; }

  return (
    <div className="protocol-summary-stage__data-source">
      <h2>DataSource</h2>
    </div>
  );
};

DataSource.propTypes = {
};

DataSource.defaultProps = {
};

export default DataSource;
