import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const appear = {
  opacity: [0, 1],
  scale: [0, 1],
  duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
};

const disappear = {
  opacity: [1, 0],
  scale: [1, 0],
  height: 0,
  margin: 0,
  duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
};

const AppearTransition = ({ children, ...props }) => (
  <Transition
    timeout={getCSSVariableAsNumber('--animation-duration-fast-ms')}
    onEnter={el => el.setAttribute('style', 'display: block;')}
    onExited={el => el.setAttribute('style', 'display: none;')}
    onEntering={
      (el) => {
        anime({
          targets: el,
          elasticity: 0,
          easing: 'easeInOutQuad',
          ...appear,
        });
      }
    }
    onExiting={
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
