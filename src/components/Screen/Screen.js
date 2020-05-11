import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ControlBar from '../ControlBar';
import { ScreenErrorBoundary } from '../Errors';

class Screen extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    transitionState: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.node),
    secondaryButtons: PropTypes.arrayOf(PropTypes.node),
    type: PropTypes.string,
    show: PropTypes.bool,
    onAcknowledgeError: PropTypes.func,
  };

  static defaultProps = {
    type: 'default',
    transitionState: null,
    children: null,
    buttons: [],
    show: true,
    secondaryButtons: [],
    onAcknowledgeError: () => {},
  }

  render() {
    const {
      buttons,
      secondaryButtons,
      onAcknowledgeError,
      children,
      type,
      show,
    } = this.props;

    const classes = cx('arch-card', `arch-card--${type}`);

    return (
      <div className={classes}>
        <div className="arch-card__content">
          <ScreenErrorBoundary onAcknowledge={onAcknowledgeError}>
            { show && children }
          </ScreenErrorBoundary>
        </div>
        <ControlBar
          flip
          buttons={buttons}
          secondaryButtons={secondaryButtons}
        />
      </div>
    );
  }
}

export { Screen };
export default Screen;
