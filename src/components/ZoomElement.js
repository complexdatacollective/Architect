/*eslint-disable*/

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { animation } from 'network-canvas-ui';

class ZoomElement extends PureComponent {
  static propTypes = {
    children: PropTypes.any.isRequired,
    colors: PropTypes.array,
  };

  static defaultProps = {
    colors: ['#ffffff', '#2d2955'],
  };

  onClick = (e) => {
    const start = this.node.getBoundingClientRect();
    const pseudoElement = document.createElement('div');
    const body = document.getElementsByTagName('body')[0];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const originY = 100 * (start.top + start.height / 2) / height;
    const originX = 100 * (start.left + start.width / 2) / width;

    console.log(start);

    pseudoElement.setAttribute(
      'style',
      `position: absolute;
      transform: translateZ(0);
      transform-origin: ${originX}% ${originY}%;
      top: ${start.top}px;
      left: ${start.left}px;
      width: ${start.width}px;
      height: ${start.height}px;`,
    );
    body.appendChild(pseudoElement);

    anime({
      targets: pseudoElement,
      elasticity: 0,
      easing: 'easeInOutQuad',
      duration: animation.duration.standard,
      opacity: [1, 0],
      scaleY: [1, height / start.height * 1.1],  // 1.1 fudge factor for scale Y origin
      scaleX: [1, width / start.width],
      backgroundColor: this.props.colors,
    }).finished.then(() => {
      body.removeChild(pseudoElement);
    });
  }

  render() {
    const {
      children,
      ...props
    } = this.props;

    return (
      <span style={{ display: 'inline-block' }} ref={(node) => {this.node = node; }} onClick={this.onClick} {...props} >
        {children}
      </span>
    );
  }
}

export default ZoomElement;
