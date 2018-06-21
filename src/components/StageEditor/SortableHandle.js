import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';

const Handle = () => (
  <div className="stage-editor-sortable-item__handle" />
);

export { Handle };

export default SortableHandle(Handle);
