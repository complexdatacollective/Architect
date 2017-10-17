import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkip: PropTypes.func.isRequired,
  };

  snapshotSrc() {
    return `/images/timeline/stage--${this.props.type}.png`;
  }

  render() {
    const {
      onEditStage,
      onEditSkip,
    } = this.props;

    return (
      <div className="timeline-stage">
        <div
          className="timeline-stage__preview"
          role="button"
          onClick={onEditStage}
          tabIndex="0"
        >
          <img src={this.snapshotSrc()} alt="" />
        </div>

        <div
          className="timeline-stage__skip"
          role="button"
          onClick={onEditSkip}
          tabIndex="0"
        >
          Edit skip
        </div>

      </div>
    );
  }
}

export default TimelineStage;
