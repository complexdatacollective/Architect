import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';

const duration = getCSSVariableAsNumber('--animation-duration-fast-ms');

const appear = {
  opacity: [0, 1],
  translateX: ['-100%', 0],
  duration,
};

const disappear = {
  opacity: [1, 0],
  translateX: [0, '-100%'],
  margin: 0,
  duration,
};

const FolderTransition = ({ children, ...props }) => (
  <Transition
    timeout={duration}
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

FolderTransition.propTypes = {
  children: PropTypes.any.isRequired,
};

FolderTransition.defaultProps = {
  children: null,
};

export default FolderTransition;
