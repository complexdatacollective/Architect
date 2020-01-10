import React from 'react';
import { Icon } from '@codaco/ui';

const NewButton = props => (
  <div className="list-new-button" {...props}>
    <Icon name="add" />
  </div>
);

export { NewButton };

export default NewButton;
