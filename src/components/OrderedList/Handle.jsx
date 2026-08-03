import { SortableHandle } from 'react-sortable-hoc';

import { Icon } from '@codaco/ui';

const Handle = (props) => (
  <div className="list-handle" {...props}>
    <Icon name="move" />
  </div>
);

export default SortableHandle(Handle);
