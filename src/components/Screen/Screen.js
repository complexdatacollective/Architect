import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'recompose';
import { motion } from 'framer-motion';
import windowRootProvider from '@codaco/ui/lib/components/windowRootProvider';
import ControlBar from '@components/ControlBar';
import { ScreenErrorBoundary } from '@components/Errors';

const Screen = ({
  buttons,
  children,
  layoutId,
  onAcknowledgeError,
  secondaryButtons,
  setWindowRoot,
  type,
  windowRoot,
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
  buttons: PropTypes.arrayOf(PropTypes.node),
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  layoutId: PropTypes.string,
  onAcknowledgeError: PropTypes.func,
  secondaryButtons: PropTypes.arrayOf(PropTypes.node),
  setWindowRoot: PropTypes.func.isRequired,
  type: PropTypes.string,
  windowRoot: PropTypes.any.isRequired, // eslint-disable-line react/forbid-prop-types
  zIndex: PropTypes.number,
};

Screen.defaultProps = {
  buttons: [],
  children: null,
  layoutId: null,
  onAcknowledgeError: () => {},
  secondaryButtons: [],
  type: 'default',
  zIndex: null,
};

export default compose(
  windowRootProvider,
)(Screen);
