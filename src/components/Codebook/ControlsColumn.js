import React from 'react';
import PropTypes from 'prop-types';
import DeleteIcon from '@material-ui/icons/DeleteRounded';
import EditIcon from '@material-ui/icons/EditRounded';
import Button from '@codaco/ui/lib/components/Button';
import RenameVariableControl from '@components/RenameVariableControl';

const ControlsColumn = ({
  id,
  inUse,
  onDelete,
  entity,
  type,
}) => (
  <>
    <RenameVariableControl
      entity={entity}
      type={type}
      id={id}
    >
      {({ onClick }) => (
        <Button
          onClick={onClick}
          size="small"
          color="sea-serpent"
          icon={<EditIcon />}
          title="Rename variable"
        />
      )}
    </RenameVariableControl>
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
  entity: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default ControlsColumn;
