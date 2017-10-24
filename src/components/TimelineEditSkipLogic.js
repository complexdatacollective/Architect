import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { Icon, animation } from 'network-canvas-ui';

class TimelineEditSkipLogic extends PureComponent {
  static propTypes = {
    onEditSkipLogic: PropTypes.func.isRequired,
  };

  onMouseEnterSkipLogic = () => {
    const el = this.track;
    const rect = el.getBoundingClientRect();
    const offset = rect.width + rect.width + rect.height;

    el.setAttribute('stroke-dasharray', offset);
    el.setAttribute('stroke-dashoffset', offset);

    this.animate = anime({
      targets: el,
      opacity: [0, 1],
      strokeDashoffset: [offset, 0],
      duration: animation.duration.standard,
      easing: animation.easing.default,
      autoplay: false,
    });

    this.animate.restart();
  }

  onMouseLeaveSkipLogic = () => {
    if (!this.animate) { return; }

    this.animate.reverse();
    this.animate.play();
  }

  render() {
    const { onEditSkipLogic } = this.props;

    return (
      <div className="timeline-edit-skip-logic">
        <svg
          preserveAspectRatio="none"
          className="timeline-edit-skip-logic__track"
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
          className="timeline-edit-skip-logic__button"
          onMouseEnter={this.onMouseEnterSkipLogic}
          onMouseLeave={this.onMouseLeaveSkipLogic}
          onClick={onEditSkipLogic}
        >
          <Icon name="error" className="timeline-edit-skip-logic__button-icon" />
        </div>
      </div>
    );
  }
}

export default TimelineEditSkipLogic;
