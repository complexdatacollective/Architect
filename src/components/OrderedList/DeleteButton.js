import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@codaco/ui';

const DeleteButton = ({ onDelete }) => (
  <div
    className="list-delete-button"
    onDelete={onDelete}
  >
    <Icon name="delete" />
  </div>
);

DeleteButton.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default DeleteButton;
