import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';

const ControlsColumn = ({ inUse, handleDelete }) => {
  if (inUse) { return null; }
  return (
    <Button
      size="small"
      color="neon-coral"
      // onClick={() => handleDelete(rowData.id, rowData.name)}
    >
      Delete variable
    </Button>
  );
};

ControlsColumn.propTypes = {
  handleDelete: PropTypes.func.isRequired,
  inUse: PropTypes.bool.isRequired,
};

export { ControlsColumn };

export default ControlsColumn;
