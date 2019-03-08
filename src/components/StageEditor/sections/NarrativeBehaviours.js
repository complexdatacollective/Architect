import React from 'react';
import { FormSection } from 'redux-form';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import * as Fields from '../../../ui/components/Fields';
import { getFieldId } from '../../../utils/issues';

const NarrativeBehaviours = () => (
  <Guidance contentId="guidance.editor.name">
    <div className="stage-editor-section">
      <FormSection name="behaviours">
        <div id={getFieldId('freeDraw')} data-name="Free draw" />
        <h2>Free-draw</h2>
        <ValidatedField
          name="behaviours.freeDraw"
          label="Allow drawing on the canvas."
          component={Fields.Checkbox}
        />

        <div id={getFieldId('allowRepositioning')} data-name="Allow repositioning" />
        <h2>Allow repositioning</h2>
        <ValidatedField
          name="behaviours.allowRepositioning"
          label="Allow repositioning of nodes."
          component={Fields.Checkbox}
        />
      </FormSection>
    </div>
  </Guidance>
);

export default NarrativeBehaviours;
