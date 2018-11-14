import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const appear = () => ({
  opacity: [0, 1],
  scale: [0, 1],
  elasticity: 0,
  easing: 'easeInOutQuad',
  duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
});

const disappear = () => ({
  opacity: [1, 0],
  scale: [1, 0],
  height: 0,
  margin: 0,
  elasticity: 0,
  easing: 'easeInOutQuad',
  duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
});

const AppearTransition = ({ children, ...props }) => (
  <Transition
    mountOnEnter
    unmountOnExit
    timeout={getCSSVariableAsNumber('--animation-duration-standard-ms')}
    onEntering={el => anime({ targets: el, ...appear() })}
    onExiting={el => anime({ targets: el, ...disappear() })}
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
