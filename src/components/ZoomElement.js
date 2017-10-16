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
    const start = e.target.getBoundingClientRect();
    const pseudoElement = document.createElement('div');
    pseudoElement.setAttribute('style', 'position:absolute;');
    document.getElementsByTagName('body')[0].appendChild(pseudoElement);

    anime({
      targets: pseudoElement,
      elasticity: 0,
      easing: 'easeInOutQuad',
      duration: animation.duration.standard,
      width: [start.width, window.innerWidth],
      height: [start.height, window.innerHeight],
      opacity: [1, 0],
      backgroundColor: this.props.colors,
      top: [start.top, 0],
      left: [start.left, 0],
    }).finished.then(() => {
      document.getElementsByTagName('body')[0].removeChild(pseudoElement);
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

export default ZoomElement;
