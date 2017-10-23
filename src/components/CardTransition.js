import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { animation } from 'network-canvas-ui';
import anime from 'animejs';

const fadeIn = {
  opacity: [0, 1],
  duration: animation.duration.fast,
};

const fadeOut = {
  opacity: [1, 0],
  duration: animation.duration.fast,
};

const wipeOut = {
  translateX: [0, '100%'],
};

const CardTransition = ({ children, cancel, timeout, ...props }) => (
  <Transition
    timeout={timeout}
    unmountOnExit
    onEnter={
      (el) => {
        anime({
          targets: el,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: timeout,
          delay: 0.5 * animation.duration.fast,
          ...fadeIn,
        });
      }
    }
    onExit={
      (el) => {
        anime({
          targets: el,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: timeout / 2,
          ...(cancel ? wipeOut : fadeOut),
        });
      }
    }
    {...props}
  >
    { children }
  </Transition>
);

CardTransition.propTypes = {
  children: PropTypes.any.isRequired,
  timeout: PropTypes.number,
  cancel: PropTypes.bool,
};

CardTransition.defaultProps = {
  children: PropTypes.any.isRequired,
  timeout: (2 * animation.duration.standard),
  cancel: true,
};

export default CardTransition;
