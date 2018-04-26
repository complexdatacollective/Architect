import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Zoom } from '../../behaviours';
import { getCSSVariableAsString } from '../../utils/CSSVariables';
import timelineImages from '../../images/timeline';

const zoomColors = [getCSSVariableAsString('--light-background'), '#ffffff'];

const getTimelineImage = type =>
  get(timelineImages, type);

const EditStageButton = Zoom(
  ({
    onEditStage,
    type,
  }) => (
    <div
      className="timeline-stage__screen"
      role="button"
      onClick={onEditStage}
      tabIndex="0"
    >
      <div className="timeline-stage__screen-preview">
        {
          getTimelineImage(type) &&
          <img
            src={getTimelineImage(type)}
            alt={`${type} Interface`}
            title={`${type} Interface`}
          />
        }
        {
          !getTimelineImage(type) &&
          `${type} Interface`
        }
      </div>
    </div>
  ),
);

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkipLogic: PropTypes.func.isRequired,
    onInsertStage: PropTypes.func.isRequired,
  };

  render() {
    const {
      onEditStage,
      type,
    } = this.props;

    return (
      <div className="timeline-stage">
        <div className="timeline-stage__notch" />
        <EditStageButton
          onEditStage={onEditStage}
          type={type}
          zoomColors={zoomColors}
        />
      </div>
    );
  }
}

export default TimelineStage;
