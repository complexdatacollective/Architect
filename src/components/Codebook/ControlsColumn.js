import React from 'react';
import PropTypes from 'prop-types';
import Button from '@codaco/ui/lib/components/Button';

const ControlsColumn = ({ id, inUse, onDelete }) => {
  if (inUse) { return null; }
  return (
    <Button
      size="small"
      color="neon-coral"
      onClick={() => onDelete(id)}
    >
      Delete variable
    </Button>
  );
};

ControlsColumn.propTypes = {
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  inUse: PropTypes.bool.isRequired,
};

export default ControlsColumn;
