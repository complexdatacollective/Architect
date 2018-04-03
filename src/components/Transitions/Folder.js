import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../utils/CSSVariables';

const appear = {
  opacity: [0, 1],
  scaleY: [0, 1],
  maxHeight: [0, '1000px'],
  duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
};

const disappear = {
  opacity: [1, 0],
  scaleY: [1, 0],
  maxHeight: ['1000px', 0],
  margin: 0,
  duration: getCSSVariableAsNumber('--animation-duration-fast-ms'),
};

const FolderTransition = ({ children, ...props }) => (
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

FolderTransition.propTypes = {
  children: PropTypes.any.isRequired,
};

FolderTransition.defaultProps = {
  children: null,
};

export default FolderTransition;
