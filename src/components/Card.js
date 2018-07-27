import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
import ControlBar from './ControlBar';
import { getCSSVariableAsNumber } from '../utils/CSSVariables';

const fadeIn = {
  opacity: [0, 1],
};

const fadeOut = {
  opacity: [1, 0],
};

const wipeOut = {
  translateX: [0, '100%'],
};

class Card extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(PropTypes.node),
    type: PropTypes.string,
    show: PropTypes.bool,
    style: PropTypes.oneOf(['fade', 'wipe']),
    enterDuration: PropTypes.number,
    enterDelay: PropTypes.number,
    exitDuration: PropTypes.number,
    exitDelay: PropTypes.number,
  };

  static defaultProps = {
    type: 'default',
    children: null,
    buttons: [],
    show: false,
    style: 'wipe',
    enterDuration: 200,
    enterDelay: getCSSVariableAsNumber('--animation-duration-standard-ms'),
    exitDuration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
    exitDelay: 0,
  }

  get anyButtons() { return this.props.buttons.length > 0; }

  render() {
    const {
      buttons,
      show,
      style,
      enterDuration,
      enterDelay,
      exitDuration,
      exitDelay,
    } = this.props;
    const classes = cx('card', `card--${this.props.type}`);
    const timeout = enterDuration + enterDelay + exitDuration + exitDelay;

    return (
      <Transition
        timeout={timeout}
        unmountOnExit
        mountOnEnter
        appear
        onEnter={
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
        onExit={
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
        in={show}
      >
        {state => (
          <div className={classes}>
            <div className="card__container">
              <div className="card__content">
                { this.props.children }
              </div>
            </div>
            <ControlBar
              show={(state === 'entering' || state === 'entered')}
              className="control-bar--delayed control-bar--align-right"
            >
              { buttons }
            </ControlBar>
          </div>
        )}
      </Transition>
    );
  }
}

export { Card };
export default Card;
