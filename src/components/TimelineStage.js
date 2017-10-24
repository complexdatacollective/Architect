import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { Icon, animation } from 'network-canvas-ui';

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkipLogic: PropTypes.func.isRequired,
  };

  onMouseEnterSkipLogic = () => {
    const el = this.track;
    const rect = el.getBoundingClientRect();
    const offset = rect.width + rect.width + rect.height;

    el.setAttribute('stroke-dasharray', offset);
    el.setAttribute('stroke-dashoffset', offset);

    this.animateSkip = anime({
      targets: el,
      opacity: [0, 1],
      strokeDashoffset: [offset, 0],
      duration: animation.duration.standard,
      easing: 'easeInOutSine',
      autoplay: false,
    });

    this.animateSkip.restart();
  }

  onMouseLeaveSkipLogic = () => {
    if (!this.animateSkip) { return; }

    this.animateSkip.reverse();
    this.animateSkip.play();
  }

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

        <svg
          preserveAspectRatio="none"
          className="timeline-stage__skip-logic-track"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <path
            ref={(track) => { this.track = track; }}
            d="M 0 0 L 100 0 L 100 100 L 0 100"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="timeline-stage__skip-logic-button"
          onMouseEnter={this.onMouseEnterSkipLogic}
          onMouseLeave={this.onMouseLeaveSkipLogic}
          onClick={onEditSkipLogic}
        >
          <Icon name="error" className="timeline-stage__skip-logic-button-icon" />
        </div>
      </div>
    );
  }
}

export default TimelineStage;
