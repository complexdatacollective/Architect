import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'network-canvas-ui';

class Card extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    onCancel: PropTypes.func,
    title: PropTypes.string.isRequired,
    type: PropTypes.string,
  };

  static defaultProps = {
    type: 'default',
    children: null,
    onCancel: () => {},
  }

  render() {
    const classes = cx('card', `card--${this.props.type}`);

    return (
      <div className={classes}>
        <div className="card__title-bar">
          <h1 className="card__heading">{ this.props.title }</h1>
        </div>
        <div className="card__main">
          { this.props.children }
        </div>
        <div className="card__control-bar">
          <Button size="small" onClick={this.props.onCancel}>cancel</Button>
        </div>
      </div>
    );
  }
}

export { Card };
export default Card;
