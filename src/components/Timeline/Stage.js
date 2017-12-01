import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { colorDictionary } from 'network-canvas-ui';
import { Zoom } from '../../behaviours';
import EditSkipLogic from './EditSkipLogic';

const zoomColors = [colorDictionary.lightBackground, colorDictionary.white];

const EditStageButton = Zoom(
  ({
    onEditStage,
    snapshotSrc,
  }) => (
    <div
      className="timeline-stage__preview"
      role="button"
      onClick={onEditStage}
      tabIndex="0"
    >
      <img
        src={snapshotSrc}
        alt=""
        className="timeline-stage__preview-image"
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

  snapshotSrc() {
    return `/images/timeline/stage--${this.props.type}.png`;
  }

  render() {
    const {
      onEditStage,
      onEditSkipLogic,
    } = this.props;

    return (
      <div className="timeline-stage">
        <EditStageButton
          onEditStage={onEditStage}
          snapshotSrc={this.snapshotSrc()}
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
