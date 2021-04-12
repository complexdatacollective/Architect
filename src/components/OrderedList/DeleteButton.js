import React from 'react';
import { Icon } from '@codaco/ui';

const DeleteButton = (props) => (
  <div
    className="list-delete-button"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <Icon name="delete" />
  </div>
);

export default DeleteButton;
