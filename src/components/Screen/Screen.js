import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'recompose';
import windowRootProvider from '@codaco/ui/lib/components/windowRootProvider';
import ControlBar from '../ControlBar';
import { ScreenErrorBoundary } from '../Errors';

const Screen = ({
  buttons,
  secondaryButtons,
  onAcknowledgeError,
  children,
  type,
  setWindowRoot,
  windowRoot,
}) => {
  const classes = cx('screen', `screen--${type}`);

  return (
    <div className={classes}>
      <div className="screen__container" ref={setWindowRoot}>
        <div className="screen__content">
          <ScreenErrorBoundary onAcknowledge={onAcknowledgeError}>
            { typeof children === 'function' &&
              children({ windowRoot })
            }
            { children && typeof children !== 'function' && children }
          </ScreenErrorBoundary>
        </div>
      </div>
      <ControlBar
        className="screen__controls"
        buttons={buttons}
        secondaryButtons={secondaryButtons}
      />
    </div>
  );
};

Screen.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.arrayOf(PropTypes.node),
  secondaryButtons: PropTypes.arrayOf(PropTypes.node),
  type: PropTypes.string,
  onAcknowledgeError: PropTypes.func,
  windowRoot: PropTypes.any.isRequired,
  setWindowRoot: PropTypes.func.isRequired,
};

Screen.defaultProps = {
  type: 'default',
  transitionState: null,
  children: null,
  buttons: [],
  secondaryButtons: [],
  onAcknowledgeError: () => {},
};

export { Screen };

export default compose(
  windowRootProvider,
)(Screen);
