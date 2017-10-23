import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { Icon } from 'network-canvas-ui';

class TimelineStage extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onEditStage: PropTypes.func.isRequired,
    onEditSkipLogic: PropTypes.func.isRequired,
  };

  onHoverSkipLogic = () => {
    console.log('mouse enter');
    anime({
      targets: this.track,
      strokeDashoffset: [anime.setDashoffset, 0],
      duration: anime.random(1000, 3000),
      delay: anime.random(0, 2000),
      easing: 'easeInOutSine',
    });
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

        <Icon
          name="add-a-screen"
          className="timeline-add-new__button-icon"
          onMouseEnter={this.onHoverSkipLogic}
          onClick={onEditSkipLogic}
        />

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
          className="timeline-skip-logic__track"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
        >
          <g fill="none" fillRule="evenodd">
            <path
              ref={(track) => { this.track = track; }}
              stroke="#31B495"
              d="M 0 0 L 100 0 L 100 100 L 0 100"
              strokeWidth="5"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>

      </div>
    );
  }
}

export default TimelineStage;
