import React from 'react';
import { Icon } from '../../../ui/components';

const DeleteButton = props => (
  <div className="stage-editor-sortable-delete-button" {...props}>
    <Icon name="delete" />
  </div>
);

export { DeleteButton };

export default DeleteButton;
