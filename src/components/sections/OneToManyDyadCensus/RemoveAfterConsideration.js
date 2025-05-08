import React from 'react';
import { Section, Row } from '@components/EditorLayout';
import ValidatedField from '@components/Form/ValidatedField';
import * as Fields from '@codaco/ui/lib/components/Fields';

const RemoveAfterConsideration = () => (
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
      <ValidatedField
        entityType="edge"
        name="behaviours.removeAfterConsideration"
        component={Fields.Boolean}
        label="Remove after consideration?"
        validation={{ required: true }}
        noReset
      />
    </Row>
  </Section>
);

export default RemoveAfterConsideration;
