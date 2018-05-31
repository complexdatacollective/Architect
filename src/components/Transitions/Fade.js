import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const appear = {
  opacity: [0, 1],
  elasticity: 0,
  easing: 'easeInOutQuad',
  duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
};

const disappear = {
  opacity: [1, 0],
  elasticity: 0,
  easing: 'easeInOutQuad',
  duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
};

const Fade = ({ children, ...props }) => (
  <Transition
    mountOnEnter
    unmountOnExit
    appear
    timeout={getCSSVariableAsNumber('--animation-duration-standard-ms')}
    onEntering={el => anime({ targets: el, ...appear })}
    onExiting={el => anime({ targets: el, ...disappear })}
    {...props}
  >
    { children }
  </Transition>
);

Fade.propTypes = {
  children: PropTypes.any,
};

Fade.defaultProps = {
  children: null,
};

export default Fade;
