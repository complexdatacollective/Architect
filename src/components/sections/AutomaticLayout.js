import React, { useState } from 'react';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import { change, formValueSelector } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import { getFieldId } from '../../utils/issues';
import DetachedField from '../DetachedField';

const FORM_PROPERTY = 'behaviours.automaticLayout.enabled';

const AutomaticLayout = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => get(state, 'form', {}));
  const formValue = useSelector((state) => !!formValueSelector(form)(state, FORM_PROPERTY));

  const [useAutomaticLayout, setUseAutomaticLayout] = useState(formValue);

  const handleChooseLayoutMode = () => {
    if (useAutomaticLayout) {
      dispatch(change('edit-stage', FORM_PROPERTY, false));
    } else {
      dispatch(change('edit-stage', FORM_PROPERTY, true));
    }

    setUseAutomaticLayout(!useAutomaticLayout);
  };

  return (
    <Section>
      <Row>
        <div id={getFieldId('behaviours.automaticLayout.enabled')} data-name="Layout mode" />
        <h3>Layout Mode</h3>
        <p>
          Interviewer offers two modes for positioning nodes on the
          sociogram: &quot;Manual&quot;, and &quot;Automatic&quot;.
        </p>
        <p>
          <strong>Automatic mode</strong>
          {' '}
          positions nodes when the stage is first shown
          by simulating physical forces such as attraction and repulsion. This
          simulation can be paused and resumed within the interview. When paused,
          the position of nodes can be adjusted manually.
        </p>
        <p>
          <strong>Manual mode</strong>
          {' '}
          first places all nodes into a &quot;bucket&quot; at the bottom
          of the screen, from which the participant can drag nodes to their desired
          position.
        </p>
      </Row>
      <Row>
        <DetachedField
          component={Fields.Boolean}
          onChange={handleChooseLayoutMode}
          value={useAutomaticLayout}
          validation={{ required: true }}
          options={[
            {
              value: false,
              label: () => (
                <div>
                  <h4>Manual mode</h4>
                  <p>Participants must position their alters manually.</p>
                </div>
              ),
            },
            {
              value: true,
              label: () => (
                <div>
                  <h4>Automatic mode</h4>
                  <p>
                    A force-directed layout positions nodes automatically.
                  </p>
                </div>
              ),
            },
          ]}
          noReset
        />
      </Row>
    </Section>
  );
};

export default AutomaticLayout;
