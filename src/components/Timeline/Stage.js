import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Zoom } from '../../behaviours';
import EditSkipLogic from './EditSkipLogic';
import { getCSSVariableAsString } from '../../utils/CSSVariables';

const zoomColors = [getCSSVariableAsString('--light-background'), '#ffffff'];

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
      <img
        src={`./images/timeline/stage--${type}.png`}
        alt={`${type} Interface`}
        title={`${type} Interface`}
        className="timeline-stage__preview-image"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
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
