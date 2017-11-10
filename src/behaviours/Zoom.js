/*eslint-disable*/

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { animation } from 'network-canvas-ui';

const Zoom = (WrappedComponent) =>
  class extends PureComponent {
    static propTypes = {
      zoomColors: PropTypes.array,
      constrain: PropTypes.array,
    };

    static defaultProps = {
      zoomColors: ['#ffffff', '#2d2955'],
      constrain: [0, 0, 0, 0],
    };

    componentDidMount() {
      this.root = document.getElementsByTagName('body')[0];
      this.node = ReactDOM.findDOMNode(this);
      this.node.addEventListener('click', this.onClick);
    }

    componentWillUnmount() {
      this.node.removeEventListener('click', this.onClick);
    }

    onClick = (e) => {
      // const root = document.getElementsByTagName('body')[0];

      const [top, right, bottom, left] = this.props.constrain;

      const start = this.node.getBoundingClientRect();
      const pseudoElement = document.createElement('div');

      const width = window.innerWidth - right - left;
      const height = window.innerHeight - top - bottom;
      const originY = 100 * (start.top + start.height / 2) / height - (100 * top / window.innerHeight);
      const originX = 100 * (start.left + start.width / 2) / width - (100 * left / window.innerWidth);

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

      this.root.appendChild(pseudoElement);

      anime({
        targets: pseudoElement,
        elasticity: 0,
        easing: 'easeInOutQuad',
        duration: animation.duration.fast,
        scaleY: [1, height / start.height],
        scaleX: [1, width / start.width],
        backgroundColor: this.props.zoomColors,
      }).finished.then(() => {
        setTimeout(() => {
          this.root.removeChild(pseudoElement);
        }, 20); // Give a little overlap
      });
    }

    render() {
      return (
        <WrappedComponent {...this.props} />
      );
    }
  }

  export default Zoom;
