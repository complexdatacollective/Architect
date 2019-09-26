import React from 'react';
import Button from '@ui/components/Button';

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

export { ControlsColumn };

export default ControlsColumn;
