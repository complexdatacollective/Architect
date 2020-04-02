import React from 'react';
import PropTypes from 'prop-types';
import { CellMeasurer } from 'react-virtualized';
import Tag from './Tag';

const UsageColumn = cache => ({
  cellData: inUse,
  rowData: { usage },
  rowIndex,
  dataKey,
  parent,
}) => (
  <CellMeasurer
    cache={cache}
    key={dataKey}
    parent={parent}
    rowIndex={rowIndex}
  >
    <div style={{ whiteSpace: 'normal' }}>
      { inUse && usage.join(', ') }
      { !inUse && <Tag>not in use</Tag> }
    </div>
  </CellMeasurer>
);

UsageColumn.propTypes = {
  cellData: PropTypes.array.isRequired,
  rowData: PropTypes.object.isRequired,
};

export default UsageColumn;
