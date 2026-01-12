import React from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import Button from '@codaco/ui/lib/components/Button';

const ControlsColumn = ({
  id,
  inUse,
  onDelete,
}) => (
  <>
    { !inUse && (
      <Button
        size="small"
        color="neon-coral"
        icon={<DeleteIcon />}
        onClick={() => onDelete(id)}
        title="Delete variable"
      />
    )}
  </>
);

ControlsColumn.propTypes = {
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  inUse: PropTypes.bool.isRequired,
};

ControlsColumn.defaultProps = {
};

export default ControlsColumn;
