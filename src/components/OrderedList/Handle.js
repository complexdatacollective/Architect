import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { Icon } from '@codaco/ui';

const Handle = (props) => (
  <div
    className="list-handle"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <Icon name="move" />
  </div>
);

export default SortableHandle(Handle);
