import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const appear = () => ({
  opacity: [0, 1],
  translateX: ['-100%', 0],
  elasticity: 0,
  easing: 'easeInOutQuad',
  duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
});

const disappear = () => ({
  opacity: [1, 0],
  translateX: [0, '-100%'],
  margin: 0,
  elasticity: 0,
  easing: 'easeInOutQuad',
  duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
});

const FolderTransition = ({ children, ...props }) => (
  <Transition
    timeout={getCSSVariableAsNumber('--animation-duration-standard-ms')}
    onEntering={el => anime({ targets: el, ...appear() })}
    onExiting={el => anime({ targets: el, ...disappear() })}
    {...props}
  >
    { children }
  </Transition>
);

FolderTransition.propTypes = {
  children: PropTypes.any.isRequired,
};

FolderTransition.defaultProps = {
  children: null,
};

export default FolderTransition;
