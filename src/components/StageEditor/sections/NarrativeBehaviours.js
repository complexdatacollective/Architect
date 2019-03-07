import React from 'react';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import * as Fields from '../../../ui/components/Fields';
import { getFieldId } from '../../../utils/issues';

// "freeDraw": true,
// "allowRepositioning": true

const NarrativeBehaviours = () => (
  <Guidance contentId="guidance.editor.name">
    <div className="stage-editor-section">
      <div id={getFieldId('freeDraw')} data-name="Free draw" />
      <h2>Free-draw</h2>
      <ValidatedField
        name="freeDraw"
        label="Allow drawing on the canvas."
        component={Fields.Checkbox}
      />

      <div id={getFieldId('allowRepositioning')} data-name="Allow repositioning" />
      <h2>Allow repositioning</h2>
      <ValidatedField
        name="allowRepositioning"
        label="Allow repositioning of nodes."
        component={Fields.Checkbox}
      />
    </div>
  </Guidance>
);

export default NarrativeBehaviours;
