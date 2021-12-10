import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Field } from 'redux-form';
import { Section, Row } from '@components/EditorLayout';

const AutomaticLayout = () => (
  <Section>
    <Row>
      <h3>Automatic Force Directed Layout</h3>
      <p>
        When force directed layout is enabled alters are positioned automatically
        by simulating forces in realtime that represent alter-ties and alter proximity.
      </p>
      <p>
        Nodes can still be moved whilst this layout is enabled, but they will be
        constrained by the simulated forces.
      </p>
    </Row>
    <Row>
      <div style={{ maxWidth: '55rem' }}>
        <Field
          component={Fields.Boolean}
          name="behaviours.automaticLayout.enabled"
          options={[
            {
              value: false,
              label: () => (
                <div>
                  <h4>Manual layout only</h4>
                  <p>Participants can position their alters manually.</p>
                </div>
              ),
            },
            {
              value: true,
              label: () => (
                <div>
                  <h4>Automatic layout enabled</h4>
                  <p>
                    In addition to positioning alters manually, a force-directed
                    layout can be activated during the interview.
                  </p>
                </div>
              ),
            },
          ]}
          label="Choose between manual and automatic layout"
          noReset
        />
      </div>
    </Row>
  </Section>
);

export default AutomaticLayout;
