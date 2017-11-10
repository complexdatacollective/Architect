import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { Icon, animation, colorDictionary } from 'network-canvas-ui';
import { Zoom } from '../behaviours';

const zoomColors = [colorDictionary.mustard, colorDictionary.mustard];
const constrain = [60, 0, 0, 0];

const SkipLogicButton = Zoom(
  ({ onEditSkipLogic, onMouseEnterSkipLogic, onMouseLeaveSkipLogic }) => (
    <div
      className="timeline-edit-skip-logic__button"
      onMouseEnter={onMouseEnterSkipLogic}
      onMouseLeave={onMouseLeaveSkipLogic}
      onClick={onEditSkipLogic}
    >
      <Icon name="error" className="timeline-edit-skip-logic__button-icon" />
    </div>
  ),
);

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

        <SkipLogicButton
          onEditSkipLogic={this.props.onEditSkipLogic}
          onMouseEnterSkipLogic={this.onMouseEnterSkipLogic}
          onMouseLeaveSkipLogic={this.onMouseLeaveSkipLogic}
          zoomColors={zoomColors}
          constrain={constrain}
        />

      </div>
    );
  }
}

export default TimelineEditSkipLogic;
