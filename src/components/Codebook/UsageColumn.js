import React from 'react';
import PropTypes from 'prop-types';

const UsageColumn = ({
  cellData: usage,
  rowData: { inUse },
}) => {
  if (inUse) { return (<div>{usage.join(', ')}</div>); }
  return (<div className="codebook__tag">not in use</div>);
};

UsageColumn.propTypes = {
  cellData: PropTypes.string.isRequired,
  rowData: PropTypes.object.isRequired,
};

export default UsageColumn;
