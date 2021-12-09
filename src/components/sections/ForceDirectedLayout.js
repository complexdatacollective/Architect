import React from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Field } from 'redux-form';
import { Section, Row } from '@components/EditorLayout';

const ForceDirectedLayout = () => (
  <Section>
    <Row>
      <h3>Force Directed Layout</h3>
      <p>
        When force directed layout is enabled alters are positioned automatically
        by simulating forces in realtime that represent alter-ties and alter proximity.
      </p>
    </Row>
    <Row>
      <div style={{ maxWidth: '55rem' }}>
        <Field
          component={Fields.Boolean}
          name="forceDirectedLayout.enabled"
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
                  <h4>Forced directed layout enabled</h4>
                  <p>
                    In addition to positioning alters manually, a force-directed
                    layout can be activated during the interview.
                  </p>
                </div>
              ),
            },
          ]}
          label="Choose between manual and force directed layouts"
          noReset
        />
      </div>
    </Row>
  </Section>
);

export default ForceDirectedLayout;
