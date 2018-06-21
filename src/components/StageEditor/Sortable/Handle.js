import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import { Icon } from '../../../ui/components';

const Handle = props => (
  <div className="stage-editor-sortable-handle" {...props}>
    <Icon name="move" />
  </div>
);

export { Handle };

export default SortableHandle(Handle);
