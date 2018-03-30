import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const appear = {
  opacity: [0, 1],
  duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
};

const disappear = {
  opacity: [1, 0],
  duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
};

const Fade = ({ children, ...props }) => (
  <Transition
    timeout={getCSSVariableAsNumber('--animation-duration-fast-ms')}
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

Fade.propTypes = {
  children: PropTypes.any.isRequired,
};

Fade.defaultProps = {
  children: null,
};

export default Fade;
