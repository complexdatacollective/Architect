import React from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import { getCSSVariableAsNumber } from '../../ui/utils/CSSVariables';

const fadeIn = {
  opacity: [0, 1],
  translateX: [0, 0],
};

const fadeOut = {
  opacity: [1, 0],
};

const wipeOut = {
  translateX: [0, '100%'],
};

const TimelineScreen = ({
  children,
  enterDelay,
  exitDelay,
  style,
  ...props
}) => {
  const enterDuration = props.enterDuration || getCSSVariableAsNumber('--animation-duration-standard-ms');
  const exitDuration = props.exitDuration || getCSSVariableAsNumber('--animation-duration-standard-ms');
  const timeout = enterDuration + enterDelay + exitDuration + exitDelay;

  return (
    <Transition
      mountOnEnter
      unmountOnExit
      appear
      timeout={timeout}
      onEntering={
        (el) => {
          anime({
            targets: el,
            elasticity: 0,
            easing: 'easeInOutQuad',
            duration: enterDuration,
            delay: enterDelay,
            ...fadeIn,
          });
        }
      }
      onExiting={
        (el) => {
          anime({
            targets: el,
            elasticity: 0,
            easing: 'easeInOutQuad',
            duration: exitDuration,
            delay: exitDelay,
            ...(style === 'wipe' ? wipeOut : fadeOut),
          });
        }
      }
      {...props}
    >
      { children }
    </Transition>
  );
};

TimelineScreen.propTypes = {
  children: PropTypes.any,
  enterDelay: PropTypes.number,
  exitDelay: PropTypes.number,
  enterDuration: PropTypes.number,
  exitDuration: PropTypes.number,
  style: PropTypes.string,
};

TimelineScreen.defaultProps = {
  children: null,
  enterDelay: 0,
  exitDelay: 0,
  enterDuration: null,
  exitDuration: null,
  style: 'wipe',
};

export default TimelineScreen;
