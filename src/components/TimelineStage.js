import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TimelineEditSkipLogic from './TimelineEditSkipLogic';

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
        <div
          className="timeline-stage__preview"
          role="button"
          onClick={onEditStage}
          tabIndex="0"
        >
          <img src={this.snapshotSrc()} alt="" className="timeline-stage__preview-image" />
        </div>

        <TimelineEditSkipLogic onEditSkipLogic={onEditSkipLogic} />
      </div>
    );
  }
}

export default TimelineStage;
