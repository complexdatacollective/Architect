import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { animation } from 'network-canvas-ui';
import anime from 'animejs';

const appear = {
  opacity: [0, 1],
  scale: [0, 1],
  duration: animation.duration.fast,
};

const disappear = {
  opacity: [1, 0],
  scale: [1, 0],
  height: 0,
  margin: 0,
  duration: animation.duration.fast,
};

const AppearTransition = ({ children, ...props }) => (
  <Transition
    timeout={animation.duration.fast}
    onEnter={
      (el) => {
        anime({
          targets: el,
          elasticity: 0,
          easing: 'easeInOutQuad',
          ...appear,
        });
      }
    }
    onExit={
      (el) => {
        anime({
          targets: el,
          elasticity: 0,
          easing: 'easeInOutQuad',
          ...disappear,
        });
      }
    }
    {...props}
  >
    { children }
  </Transition>
);

AppearTransition.propTypes = {
  children: PropTypes.any.isRequired,
};

AppearTransition.defaultProps = {
  children: null,
};

export default AppearTransition;
