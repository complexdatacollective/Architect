import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'recompose';
import { motion, useElementScroll } from 'framer-motion/dist/framer-motion';
import windowRootProvider from '@codaco/ui/lib/components/windowRootProvider';
import { ScreenErrorBoundary } from '@components/Errors';

export const ScreenContext = React.createContext({
  scrollY: 0,
  updateScrollY: () => {},
});

const screenVariants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      // when: 'beforeChildren',
    },
  },
  hidden: {
    y: '-15%',
    opacity: 0,
    when: 'beforeChildren',
    transition: {
      damping: 20,
    },
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
  layoutId,
  className,
  onComplete,
}) => {
  const classes = cx('screen', className);
  const [currentScroll, setCurrentScroll] = React.useState(0);

  const ref = useRef(null);
  const { scrollY } = useElementScroll(ref);

  useEffect(() => {
    scrollY.onChange((progress) => {
      setCurrentScroll(progress);
    });
  }, [scrollY]);

  return (
    <ScreenContext.Provider value={{ scrollY: currentScroll }}>
      <div
        className="modal__background screen-wrapper"
      >
        <motion.div
          className={classes}
          // layoutId={layoutId}
          variants={screenVariants}
        >
          <ScreenErrorBoundary>
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
      </div>
    </ScreenContext.Provider>
  );
};

Screen.propTypes = {
  children: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  layoutId: PropTypes.string,
  onAcknowledgeError: PropTypes.func,
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
