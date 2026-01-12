import React from 'react';
import { FormSection, Field } from 'redux-form';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section } from '@components/EditorLayout';
import IssueAnchor from '../IssueAnchor';

const NarrativeBehaviours = () => (
  <Section
    title="Narrative Behaviours"
  >
    <FormSection name="behaviours">
      <h4>Free-draw</h4>
      <IssueAnchor fieldName="behaviours.freeDraw" description="Free draw">
        <Field
          name="freeDraw"
          label="Allow drawing on the canvas"
          component={Fields.Toggle}
        />
      </IssueAnchor>
      <h4>Allow repositioning</h4>
      <IssueAnchor fieldName="behaviours.allowRepositioning" description="Allow repositioning">
        <Field
          name="allowRepositioning"
          label="Allow nodes to be repositioned"
          component={Fields.Toggle}
        />
      </IssueAnchor>
    </FormSection>
  </Section>
);

export default NarrativeBehaviours;
