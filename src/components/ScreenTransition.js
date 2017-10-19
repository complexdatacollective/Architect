import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { animation } from 'network-canvas-ui';
import anime from 'animejs';

const fadeOut = {
  opacity: [1, 0],
  duration: animation.duration.fast,
};

const expand = {
  scale: [0, 1],
  opacity: [0, 1],
};

const ScreenTransition = ({ children, timeout, ...props }) => (
  <Transition
    timeout={timeout}
    unmountOnExit
    appear
    onEnter={
      (el) => {
        el.setAttribute('style', `${el.getAttribute('style')}; transform-origin: 50vw 50vh;`);

        anime({
          targets: el,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: timeout,
          ...expand,
        });
      }
    }
    onExit={
      (el) => {
        el.setAttribute('style', `${el.getAttribute('style')}; transform-origin: 50vw 50vh;`);

        anime({
          targets: el,
          elasticity: 0,
          easing: 'easeInOutQuad',
          duration: timeout,
          ...fadeOut,
        });
      }
    }
    {...props}
  >
    { children }
  </Transition>
);

ScreenTransition.propTypes = {
  children: PropTypes.any.isRequired,
  timeout: PropTypes.number,
};

ScreenTransition.defaultProps = {
  children: PropTypes.any.isRequired,
  timeout: animation.duration.slow,
};

export default ScreenTransition;
