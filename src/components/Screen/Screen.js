import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'recompose';
import { motion } from 'framer-motion';
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
  layoutId,
  zIndex,
}) => {
  const classes = cx('screen', `screen--${type}`);
  const styles = zIndex ? { zIndex } : {};

  return (
    <div
      className={classes}
      styles={styles}
    >
      <div className="screen__container" ref={setWindowRoot}>
        <motion.div
          className="screen__content"
          layoutId={layoutId}
        >
          <ScreenErrorBoundary onAcknowledge={onAcknowledgeError}>
            { typeof children === 'function'
              && children({ windowRoot })}
            { children && typeof children !== 'function' && children }
          </ScreenErrorBoundary>
        </motion.div>
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
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
  buttons: PropTypes.arrayOf(PropTypes.node),
  secondaryButtons: PropTypes.arrayOf(PropTypes.node),
  type: PropTypes.string,
  onAcknowledgeError: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  windowRoot: PropTypes.any.isRequired,
  setWindowRoot: PropTypes.func.isRequired,
};

Screen.defaultProps = {
  type: 'default',
  children: null,
  buttons: [],
  secondaryButtons: [],
  onAcknowledgeError: () => {},
};

export default compose(
  windowRootProvider,
)(Screen);
