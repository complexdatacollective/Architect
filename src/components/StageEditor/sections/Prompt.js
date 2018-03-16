/* eslint-disable */

import React from 'react';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';
import { Icon } from 'network-canvas-ui';
import { SeamlessTextInput, Button } from '../../Form';

const Handle = SortableHandle(() => (
  <div className="stage-editor-section-content-item__handle" />
));

// {
//   "id": "closeness1",
//   "text": "Position the nodes amongst the concentric circles. Place people you are closer to towards the middle",
//   "subject": {
//     "entity": "node",
//     "type": "person"
//   },
// }

const Prompt = ({ text, onChange, onDelete }) => (
  <div className="prompt">
    <Handle />

    <div>
      <SeamlessTextInput
        value={text}
        onChange={(newValue) => { onChange({ text: newValue }) }}
      />
    </div>

    <Button
      onClick={onDelete}
    ><Icon name="close" /></Button>
  </div>
);

export { Prompt };

export default SortableElement(Prompt);
