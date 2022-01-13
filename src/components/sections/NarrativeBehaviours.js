import React from 'react';
import { FormSection, Field } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import { getFieldId } from '../../utils/issues';

const NarrativeBehaviours = () => (
  <Section
    title="Narrative Behaviours"
  >
    <FormSection name="behaviours">
      <div id={getFieldId('freeDraw')} data-name="Free draw" />
      <h4>Free-draw</h4>
      <Field
        name="freeDraw"
        label="Allow drawing on the canvas"
        component={Fields.Toggle}
      />

      <div id={getFieldId('allowRepositioning')} data-name="Allow repositioning" />
      <h4>Allow repositioning</h4>
      <Field
        name="allowRepositioning"
        label="Allow nodes to be repositioned"
        component={Fields.Toggle}
      />
    </FormSection>
  </Section>
);

export default NarrativeBehaviours;
