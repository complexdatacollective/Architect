import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const appear = {
  translateY: ['-100%', 0],
  elasticity: 0,
  easing: 'easeInOutQuad',
  duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
};

const Drop = ({ children, ...props }) => (
  <Transition
    mountOnEnter
    unmountOnExit
    appear
    timeout={getCSSVariableAsNumber('--animation-duration-fast-ms')}
    onEntering={el => anime({ targets: el, ...appear })}
    {...props}
  >
    { children }
  </Transition>
);

Drop.propTypes = {
  children: PropTypes.any,
};

Drop.defaultProps = {
  children: null,
};

export default Drop;
