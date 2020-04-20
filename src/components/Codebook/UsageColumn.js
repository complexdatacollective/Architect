import React from 'react';
import PropTypes from 'prop-types';
import Tag from './Tag';

const UsageColumn = ({
  inUse,
  usage,
}) => {
  if (inUse) { return (<div>{usage.join(', ')}</div>); }
  return (<Tag>not in use</Tag>);
};

UsageColumn.propTypes = {
  usage: PropTypes.array.isRequired,
  inUse: PropTypes.bool.isRequired,
};

export default UsageColumn;
