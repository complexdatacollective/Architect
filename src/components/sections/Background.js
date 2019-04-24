import React from 'react';
import {
  Field,
} from 'redux-form';
import Guidance from '../Guidance';
import * as Fields from '../../ui/components/Fields';
import * as ArchitectFields from '../Form/Fields';
import { Row } from '../OrderedList';

// Background options
const BACKGROUND_IMAGE = 'BACKGROUND/BACKGROUND_IMAGE';
const CONCENTRIC_CIRCLES = 'BACKGROUND/CONCENTRIC_CIRCLES';

class Background extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundType: CONCENTRIC_CIRCLES,
    };
  }

  handleChooseBackgroundType = (option) => {
    this.setState({ backgroundType: option });
  }

  render() {
    const { backgroundType } = this.state;

    return (
      <Guidance contentId="guidance.editor.background">
        <div className="stage-editor-section">
          <Row>
            <h3>Background</h3>
            <p>
              This section determines the graphical background for this prompt. You can choose
              between a conventional series of concentric circles, or provide your own
              background image.
            </p>
          </Row>
          <Row>
            <ArchitectFields.Mode
              label="Choose a background type"
              options={[
                { value: CONCENTRIC_CIRCLES, label: 'Circles' },
                { value: BACKGROUND_IMAGE, label: 'Image' },
              ]}
              input={{
                value: backgroundType,
                onChange: this.handleChooseBackgroundType,
              }}
            />
          </Row>
          { (backgroundType === CONCENTRIC_CIRCLES) &&
            <React.Fragment>
              <Row>
                <Field
                  name="background.concentricCircles"
                  component={Fields.Number}
                  label="Number of concentric circles to use:"
                  type="number"
                  placeholder="3"
                  normalize={value => parseInt(value, 10)}
                  validation={{ required: true }}
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
          { (backgroundType === BACKGROUND_IMAGE) &&
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
        </div>
      </Guidance>
    );
  }
}

export default Background;
