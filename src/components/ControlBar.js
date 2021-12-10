import React from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import cx from 'classnames';

const buttonVariants = {
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
  hide: { opacity: 0, y: 10 },
};

const animatedButton = (button, index) => (
  <motion.div
    key={(button && button.key) || index}
    variants={buttonVariants}
    initial="hide"
    animate="show"
    exit="hide"
    layout
  >
    {button}
  </motion.div>
);

const ControlBar = ({ buttons, secondaryButtons, className }) => {
  const buttonLayout = [
    <motion.div layout className="control-bar__secondary-buttons" key="secondary">
      <AnimateSharedLayout>
        <AnimatePresence>
          { secondaryButtons
            && Array.from(secondaryButtons).map(animatedButton)}
        </AnimatePresence>
      </AnimateSharedLayout>
    </motion.div>,
    <motion.div layout className="control-bar__primary-buttons" key="primary">
      <AnimateSharedLayout>
        <AnimatePresence>
          { buttons
            && Array.from(buttons).map(animatedButton)}
        </AnimatePresence>
      </AnimateSharedLayout>
    </motion.div>,
  ];

  return (
    <div
      className={cx(
        'control-bar',
        className,
      )}
    >
      { buttonLayout }
    </div>
  );
};

ControlBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  secondaryButtons: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
};

ControlBar.defaultProps = {
  buttons: null,
  secondaryButtons: null,
  className: '',
};

export default ControlBar;
