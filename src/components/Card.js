import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ControlBar from './ControlBar';
import { CardErrorBoundary } from './Errors/';
import window from '../ui/components/window';

class Card extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    state: PropTypes.object,
    buttons: PropTypes.arrayOf(PropTypes.node),
    secondaryButtons: PropTypes.node,
    type: PropTypes.string,
    show: PropTypes.bool,
    onAcknowledgeError: PropTypes.func,
  };

  static defaultProps = {
    type: 'default',
    state: null,
    children: null,
    buttons: [],
    show: true,
    secondaryButtons: null,
    onAcknowledgeError: null,
  }

  handleAcknowledgeError = () => this.props.onAcknowledgeError();

  render() {
    const {
      buttons,
      secondaryButtons,
      state,
      children,
      type,
      show,
    } = this.props;

    const classes = cx('arch-card', `arch-card--${type}`);

    const isEntering = state === 'entering' || state === 'entered';

    return (
      <div className={classes}>
        <div className="arch-card__content">
          <CardErrorBoundary onAcknowledge={this.handleAcknowledgeError}>
            { show && children }
          </CardErrorBoundary>
        </div>
        <ControlBar
          show={isEntering}
          className="control-bar--delayed"
          flip
          buttons={buttons}
          secondaryButtons={secondaryButtons}
        />
      </div>
    );
  }
}

export { Card };
export default window(Card);
