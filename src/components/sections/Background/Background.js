import React, { PureComponent } from 'react';
import {
  Field,
} from 'redux-form';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import * as Fields from '@codaco/ui/lib/components/Fields';
import { Section, Row } from '@components/EditorLayout';
import DetachedField from '../../DetachedField';
import ValidatedField from '../../Form/ValidatedField';
import Image from '../../Form/Fields/Image';
import withBackgroundChangeHandler from './withBackgroundChangeHandler';
import IssueAnchor from '../../IssueAnchor';

class Background extends PureComponent {
  render() {
    const {
      handleChooseBackgroundType,
      useImage,
    } = this.props;

    return (
      <Section
        title="Background"
        summary={(
          <p>
            This section determines the graphical background for this prompt. You can choose
            between a conventional series of concentric circles, or provide your own
            background image.
          </p>
        )}
      >
        <Row>
          <DetachedField
            name="background.useImage"
            component={Fields.Boolean}
            value={useImage}
            options={[
              {
                value: false,
                label: () => (
                  <div>
                    <h4>Concentric Circles</h4>
                    <p>Use the conventional concentric circles sociogram background.</p>
                  </div>
                ),
              },
              {
                value: true,
                label: () => (
                  <div>
                    <h4>Image</h4>
                    <p>Use a custom image of your choosing as the background.</p>
                  </div>
                ),
              },
            ]}
            onChange={handleChooseBackgroundType}
            label="Choose a background type"
            noReset
          />
        </Row>
        { (!useImage)
          && (
          <>
            <Row>
              <ValidatedField
                name="background.concentricCircles"
                issueDescription="Background &gt; Concentric Circles"
                component={Fields.Number}
                label="Number of concentric circles to use:"
                type="number"
                normalize={(value) => parseInt(value, 10) || value}
                validation={{ required: true, positiveNumber: true }}
              />
            </Row>
            <Row>
              <IssueAnchor fieldName="background.skewedTowardCenter" description="Background &gt; Skewed toward center" />
              <Field
                name="background.skewedTowardCenter"
                component={Fields.Toggle}
                label="Skew the size of the circles so that the middle is proportionally larger."
              />
            </Row>
          </>
          )}
        { (useImage)
          && (
          <Row>
            <ValidatedField
              name="background.image"
              issueDescription="Background &gt; Image"
              component={Image}
              label="Background image"
              validation={{ required: true }}
            />
          </Row>
          )}
      </Section>
    );
  }
}

Background.propTypes = {
  handleChooseBackgroundType: PropTypes.func.isRequired,
  useImage: PropTypes.bool.isRequired,
};

export { Background };

export default compose(
  withBackgroundChangeHandler,
)(Background);
