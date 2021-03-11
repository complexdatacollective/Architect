import React from 'react';
import { Icon } from '@codaco/ui';

const DeleteButton = (props) => (
  <div className="list-delete-button" {...props}>
    <Icon name="delete" />
  </div>
);

export { DeleteButton };

export default DeleteButton;
