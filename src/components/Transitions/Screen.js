import React from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs';
import { Transition } from 'react-transition-group';
import { getCSSVariableAsNumber } from '../../utils/CSSVariables';


const expand = {
  scale: [0, 1],
  opacity: [0, 1],
};

const ScreenTransition = ({ children, timeout, ...props }) => (
  <Transition
    timeout={timeout}
    unmountOnExit
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
  timeout: getCSSVariableAsNumber('--animation-duration-slow-ms'),
};

export default ScreenTransition;
