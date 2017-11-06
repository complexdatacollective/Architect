import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Card extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(PropTypes.node),
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'default',
    children: null,
    buttons: [],
  }

  anyButtons = () => this.props.buttons.length > 0;

  render() {
    const classes = cx('card', `card--${this.props.type}`);
    const { buttons } = this.props;

    return (
      <div className={classes}>
        <div className="card__title-bar">
          <h1 className="card__heading">{ this.props.title }</h1>
        </div>
        <div className="card__main">
          { this.props.children }
        </div>
        { this.anyButtons() &&
          <div className="card__control-bar">
            { buttons }
          </div>
        }
      </div>
    );
  }
}

export { Card };
export default Card;
