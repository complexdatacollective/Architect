import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion, useElementScroll } from 'framer-motion';
import { ScreenErrorBoundary } from '@components/Errors';
import { useDispatch } from 'react-redux';
import { actionCreators as screenActions } from '@modules/ui/screens';

export const ScreenContext = React.createContext({
  scrollY: 0,
  updateScrollY: () => {},
});

const screenVariants = {
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      when: 'beforeChildren',
    },
  },
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
};

const item = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Screen = ({
  header,
  footer,
  children,
  className,
  onComplete,
  beforeCloseHandler,
}) => {
  const classes = cx('screen', className);
  const [currentScroll, setCurrentScroll] = React.useState(0);
  const dispatch = useDispatch();

  const closeStageScreen = () => {
    dispatch(screenActions.closeScreen('stage'));
    onComplete();
  };

  const ref = useRef(null);
  const { scrollY } = useElementScroll(ref);

  useEffect(() => {
    scrollY.onChange((progress) => {
      setCurrentScroll(progress);
    });
  }, [scrollY]);

  const handleClose = () => {
    if (beforeCloseHandler) {
      const outcome = beforeCloseHandler();
      if (outcome) {
        onComplete();
      }
      return;
    }

    onComplete();
  };

  return (
    <div className="screen-wrapper">
      <ScreenContext.Provider value={{ scrollY: currentScroll }}>
        <div
          className="modal__background"
          onClick={handleClose}
        />
        <motion.div
          className={classes}
          // layoutId={layoutId}
          variants={screenVariants}
        >
          <ScreenErrorBoundary onAcknowledge={closeStageScreen}>
            <motion.header variants={item} className="screen__header">
              {header}
            </motion.header>
            <motion.main variants={item} className="screen__content" ref={ref}>
              {children}
            </motion.main>
            <motion.footer variants={item} className="screen__footer">
              {footer}
            </motion.footer>
          </ScreenErrorBoundary>
        </motion.div>
      </ScreenContext.Provider>
    </div>
  );
};

Screen.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
  onComplete: PropTypes.func,
  beforeCloseHandler: PropTypes.func,
};

Screen.defaultProps = {
  className: '',
  header: null,
  footer: null,
  onComplete: () => {},
  beforeCloseHandler: null,
};

export default Screen;
