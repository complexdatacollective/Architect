import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Transition } from 'react-transition-group';
import { animation } from 'network-canvas-ui';
import anime from 'animejs';

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
    title: PropTypes.string.isRequired,
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

  anyButtons = () => this.props.buttons.length > 0;

  render() {
    const { buttons, cancel, show } = this.props;
    const classes = cx('card', `card--${this.props.type}`);

    return (
      <Transition
        timeout={animation.duration.fast * 2}
        unmountOnExit
        onEnter={
          (el) => {
            anime({
              targets: el,
              elasticity: 0,
              easing: 'easeInOutQuad',
              duration: 1,
              delay: animation.duration.fast,
              ...fadeIn,
            });
            anime({
              targets: this.el,
              elasticity: 0,
              easing: 'easeInOutQuad',
              duration: animation.duration.fast,
              delay: animation.duration.fast,
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
              duration: animation.duration.fast,
              ...(cancel ? wipeOut : fadeOut),
            });
          }
        }
        in={show}
      >
        {state => (
          <div className={classes}>
            <div className="card__container" ref={(el) => { this.el = el; }}>
              <div className="card__content">
                <div className="card__title-bar">
                  <h1 className="card__heading">{ this.props.title }</h1>
                </div>
                <div className="card__main">
                  { this.props.children }
                </div>
              </div>
              { this.anyButtons() &&
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
