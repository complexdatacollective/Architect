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
    const startX = start.left + start.width / 2;
    const startY = start.top + start.height / 2;

    pseudoElement.setAttribute(
      'style',
      `position: absolute; transform-origin: ${startX}px ${startY}px; transform: translateZ(0); top: 0; left: 0; width: ${width}px; height: ${height}px;`,
    );
    body.appendChild(pseudoElement);

    anime({
      targets: pseudoElement,
      elasticity: 0,
      easing: 'easeInOutQuad',
      duration: animation.duration.standard,
      opacity: [1, 1],
      scale: [0, 1],
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
      <div ref={(node) => {this.node = node; }} onClick={this.onClick} {...props} >
        {children}
      </div>
    );
  }
}

export default ZoomElement;
