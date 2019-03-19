import React from 'react';
import { FormSection } from 'redux-form';
import Guidance from '../../Guidance';
import { ValidatedField } from '../../../components/Form';
import * as Fields from '../../../ui/components/Fields';
import { getFieldId } from '../../../utils/issues';

const NarrativeBehaviours = () => (
  <Guidance contentId="guidance.editor.narrative_behaviours">
    <div className="stage-editor-section">
      <h2>Narrative Behaviours</h2>
      <FormSection name="behaviours">
        <div id={getFieldId('freeDraw')} data-name="Free draw" />
        <h4>Free-draw</h4>
        <ValidatedField
          name="freeDraw"
          label="Allow drawing on the canvas."
          component={Fields.Checkbox}
        />

        <div id={getFieldId('allowRepositioning')} data-name="Allow repositioning" />
        <h4>Allow repositioning</h4>
        <ValidatedField
          name="allowRepositioning"
          label="Allow repositioning of nodes."
          component={Fields.Checkbox}
        />
      </FormSection>
    </div>
  </Guidance>
);

export default NarrativeBehaviours;
