/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { animation } from 'network-canvas-ui';
import anime from 'animejs';

const fadeIn = {
  opacity: [0, 1],
  translateX: [0, 0],
  duration: animation.duration.fast,
};

const fadeOut = {
  opacity: [1, 0],
  duration: animation.duration.fast,
};

const wipeOut = {
  translateX: [0, '100%'],
};

const CardTransition = ({ children, cancel, timeout, ...props }) => {
  return (
    <Transition
      timeout={timeout}
      appear
      onEnter={
        (el) => {
          anime({
            targets: el,
            elasticity: 0,
            easing: 'easeInOutQuad',
            duration: timeout,
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
            duration: timeout,
            ...(cancel ? wipeOut : fadeOut),
          });
        }
      }
      {...props}
    >
      { children }
    </Transition>
  );
}

CardTransition.propTypes = {
  children: PropTypes.any.isRequired,
  timeout: PropTypes.number,
};

CardTransition.defaultProps = {
  children: PropTypes.any.isRequired,
  timeout: animation.duration.slow,
};

export default CardTransition;
