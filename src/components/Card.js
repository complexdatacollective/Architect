import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Transition } from 'react-transition-group';
import anime from 'animejs';
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
    cancel: PropTypes.bool,
  };

  static defaultProps = {
    type: 'default',
    children: null,
    buttons: [],
    cancel: false,
    show: false,
  }

  get anyButtons() { return this.props.buttons.length > 0; }

  render() {
    const { buttons, cancel, show } = this.props;
    const classes = cx('card', `card--${this.props.type}`);

    return (
      <Transition
        timeout={getCSSVariableAsNumber('--animation-duration-standard-ms') * 2}
        unmountOnExit
        appear
        onEnter={
          (el) => {
            anime({
              targets: el,
              elasticity: 0,
              easing: 'easeInOutQuad',
              duration: 1,
              delay: getCSSVariableAsNumber('--animation-duration-standard-ms'),
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
              duration: getCSSVariableAsNumber('--animation-duration-standard-ms'),
              ...(cancel ? wipeOut : fadeOut),
            });
          }
        }
        in={show}
      >
        {state => (
          <div className={classes}>
            <div className="card__container">
              <div className="card__content">
                <div className="card__main">
                  { this.props.children }
                </div>
              </div>
              { this.anyButtons &&
                <div className={cx('card__control-bar', `card__control-bar--${state}`)}>
                  { buttons }
                </div>
              }
            </div>
          </div>
        )}
      </Transition>
    );
  }
}

export { Card };
export default Card;
