import React from 'react';

const UsageColumn = ({ cellData: usage, rowData: { inUse } }) => {
  if (inUse) { return (<div>{usage}</div>); }
  return (<div className="simple-list__tag">not in use</div>);
};

export default UsageColumn;
