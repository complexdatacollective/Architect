import React from 'react';
import { FormSection, Field } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';

const NarrativeBehaviours = () => (
  <Section contentId="guidance.editor.narrative_behaviours">
    <h2>Narrative Behaviours</h2>
    <FormSection name="behaviours">
      <div id={getFieldId('freeDraw')} data-name="Free draw" />
      <h4>Free-draw</h4>
      <Field
        name="freeDraw"
        label="Allow drawing on the canvas."
        component={Fields.Checkbox}
      />

      <div id={getFieldId('allowRepositioning')} data-name="Allow repositioning" />
      <h4>Allow repositioning</h4>
      <Field
        name="allowRepositioning"
        label="Allow repositioning of nodes."
        component={Fields.Checkbox}
      />
    </FormSection>
  </Section>
);

export default NarrativeBehaviours;
