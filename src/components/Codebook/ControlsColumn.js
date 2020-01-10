import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';

const ControlsColumn = ({ rowData, columnData }) => {
  if (rowData.inUse) { return null; }
  return (
    <Button
      size="small"
      color="neon-coral"
      onClick={() => columnData.handleDelete(rowData.id, rowData.name)}
    >
      Delete variable
    </Button>
  );
};

ControlsColumn.propTypes = {
  rowData: PropTypes.object.isRequired,
  columnData: PropTypes.object.isRequired,
};

export { ControlsColumn };

export default ControlsColumn;
