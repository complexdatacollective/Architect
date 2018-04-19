import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Zoom } from '../../behaviours';
import EditSkipLogic from './EditSkipLogic';
import { getCSSVariableAsString } from '../../utils/CSSVariables';
import timelineImages from '../../images/timeline';

const zoomColors = [getCSSVariableAsString('--light-background'), '#ffffff'];

const getTimelineImage = (type) => {
  console.log('getTimelineImage', timelineImages, type, get(timelineImages, type));
  return get(timelineImages, type);
};

const EditStageButton = Zoom(
  ({
    onEditStage,
    type,
  }) => (
    <div
      className="timeline-stage__preview"
      role="button"
      onClick={onEditStage}
      tabIndex="0"
    >
      <div className="timeline-stage__preview-caption">{`${type} Interface`}</div>
      {
        getTimelineImage(type) &&
        <img
          src={getTimelineImage(type)}
          alt={`${type} Interface`}
          title={`${type} Interface`}
          className="timeline-stage__preview-image"
        />
      }
    </div>
  ),
);

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkipLogic: PropTypes.func.isRequired,
  };

  render() {
    const {
      onEditStage,
      onEditSkipLogic,
      type,
    } = this.props;

    return (
      <div className="timeline-stage">
        <EditStageButton
          onEditStage={onEditStage}
          type={type}
          zoomColors={zoomColors}
        />
        <EditSkipLogic
          onEditSkipLogic={onEditSkipLogic}
        />
      </div>
    );
  }
}

export default TimelineStage;
