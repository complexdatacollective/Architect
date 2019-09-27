import React from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';

const UsageColumn = ({
  cellData: usage,
  rowData: { inUse },
}) => {
  if (inUse) { return (<div>{usage.join(', ')}</div>); }
  return (<Tag>not in use</Tag>);
};

UsageColumn.propTypes = {
  cellData: PropTypes.array.isRequired,
  rowData: PropTypes.object.isRequired,
};

export default UsageColumn;
