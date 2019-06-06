import React, { PureComponent } from 'react';
import {
  Field,
} from 'redux-form';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import * as Fields from '../../../ui/components/Fields';
import DetachedField from '../../DetachedField';
import ValidatedField from '../../Form/ValidatedField';
import * as ArchitectFields from '../../Form/Fields';
import Section from '../Section';
import Row from '../Row';
import withBackgroundChangeHandler from './withBackgroundChangeHandler';

class Background extends PureComponent {
  static propTypes = {
    handleChooseBackgroundType: PropTypes.func.isRequired,
    useImage: PropTypes.bool.isRequired,
  };

  render() {
    const {
      handleChooseBackgroundType,
      useImage,
    } = this.props;

    return (
      <Section contentId="guidance.editor.background">
        <Row>
          <h3>Background</h3>
          <p>
            This section determines the graphical background for this prompt. You can choose
            between a conventional series of concentric circles, or provide your own
            background image.
          </p>
        </Row>
        <Row>
          <DetachedField
            component={ArchitectFields.Mode}
            value={useImage}
            options={[
              { value: false, label: 'Circles' },
              { value: true, label: 'Image' },
            ]}
            onChange={handleChooseBackgroundType}
            label="Choose a background type"
          />
        </Row>
        { (!useImage) &&
          <React.Fragment>
            <Row>
              <ValidatedField
                name="background.concentricCircles"
                component={Fields.Number}
                label="Number of concentric circles to use:"
                type="number"
                normalize={value => parseInt(value, 10) || value}
                validation={{ required: true, positiveNumber: true }}
              />
            </Row>
            <Row>
              <Field
                name="background.skewedTowardCenter"
                component={Fields.Checkbox}
                label="Skew the size of the circles so that the middle is proportionally larger."
              />
            </Row>
          </React.Fragment>
        }
        { (useImage) &&
          <Row>
            <div style={{ position: 'relative', minHeight: '100px' }}>
              <Field
                name="background.image"
                component={ArchitectFields.Image}
                label="Background image"
              />
            </div>
          </Row>
        }
      </Section>
    );
  }
}

export { Background };

export default compose(
  withBackgroundChangeHandler,
)(Background);
