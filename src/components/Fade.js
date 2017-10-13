import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { animation } from 'network-canvas-ui';
import anime from 'animejs';

const Fade = ({ children, timeout, ...props }) => (
  <Transition
    onExit={
      (el) => {
        anime({
          targets: el,
          opacity: [1, 0],
          scale: [1, 0],
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: timeout,
        });
      }
    }
    onEntering={
      (el) => {
        anime({
          targets: el,
          opacity: [0, 1],
          scale: [0, 1],
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: timeout,
        });
      }
    }
    {...props}
  >
    {state => state !== 'exited' && children }
  </Transition>
);

Fade.propTypes = {
  children: PropTypes.any.isRequired,
  timeout: PropTypes.number,
};

Fade.defaultProps = {
  children: PropTypes.any.isRequired,
  timeout: animation.duration.slow,
};

export default Fade;
