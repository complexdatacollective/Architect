import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import { change, formValueSelector } from 'redux-form';
import { useDispatch, useSelector } from 'react-redux';
import DetachedField from '../DetachedField';

const FORM_PROPERTY = 'behaviours.automaticLayout.enabled';

const AutomaticLayout = ({ form }) => {
  const dispatch = useDispatch();
  const formValue = useSelector((state) => !!formValueSelector(form)(state, FORM_PROPERTY));

  const [useAutomaticLayout, setUseAutomaticLayout] = useState(formValue);

  const handleChooseLayoutMode = () => {
    if (useAutomaticLayout) {
      dispatch(change('edit-stage', FORM_PROPERTY, false));
      setUseAutomaticLayout(false);
      return;
    }

    dispatch(change('edit-stage', FORM_PROPERTY, true));
    setUseAutomaticLayout(true);
  };

  return (
    <Section
      title="Layout Mode"
      summary={(
        <p>
          Interviewer offers two modes for positioning nodes on the
          sociogram: &quot;Manual&quot;, and &quot;Automatic&quot;.
        </p>
      )}
    >
      <Row>
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
          name="behaviours.automaticLayout.enabled"
          issueDescription="Layout mode"
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

AutomaticLayout.propTypes = {
  form: PropTypes.string.isRequired,
};

export default AutomaticLayout;
