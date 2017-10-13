import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { animation } from 'network-canvas-ui';
import getAbsoluteBoundingRect from '../utils/getAbsoluteBoundingRect';

class Zoom extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    color: PropTypes.string,
  };

  static defaultProps = {
    color: 'white',
  };

  onClick = (e) => {
    const start = getAbsoluteBoundingRect(e.target);
    const zoom = document.createElement('div');
    zoom.setAttribute(
      'style',
      `position:absolute; background-color: ${this.props.color}; opacity: 0; top: ${start.top}px; left: ${start.left}px; width: ${start.width}px; height: ${start.height}px;`,
    );
    document.getElementsByTagName('body')[0].appendChild(zoom);

    anime({
      targets: zoom,
      width: window.innerWidth,
      height: window.innerHeight,
      top: 0,
      left: 0,
      opacity: 1,
      elasticity: 0,
      easing: 'easeInOutQuad',
      duration: animation.duration.slow,
    }).finished.then(() => {
      document.getElementsByTagName('body')[0].removeChild(zoom);
    });
  }

  render() {
    return (
      <div onClick={this.onClick}>
        {this.props.children}
      </div>
    );
  }
}

export default Zoom;
