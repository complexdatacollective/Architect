import { Section, Row } from '@components/EditorLayout';
import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Field } from 'redux-form';

const OneToManyDyadCensusBehaviours = () => (
  <Section
    title="Remove After Consideration"
    summary={(
      <p>
        This toggle determines if a node should continue to be shown in the bin after
        it has been the main focal node. If it is set to true, the node will be removed
        from the pool after it has been shown in the primary position for consideration.
      </p>
  )}
  >
    <Row>
      <Field
        name="behaviours.removeAfterConsideration"
        component={Fields.Boolean}
        options={[
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ]}
        noReset
      />
    </Row>
  </Section>
);

export default OneToManyDyadCensusBehaviours;
