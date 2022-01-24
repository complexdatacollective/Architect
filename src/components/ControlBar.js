import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import cx from 'classnames';

const barVariants = {
  visible: {
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      stiffness: 300,
      damping: 30,
    },
  },
  hidden: {
    y: '100%',
    transition: {
      when: 'afterChildren',
    },
  },
};

const buttonVariants = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 10 },
};

const animatedButton = (button, index) => (
  <motion.div
    key={(button && button.key) || index}
    variants={buttonVariants}
    exit="hidden"
    layout
  >
    {button}
  </motion.div>
);

const ControlBar = ({ buttons, secondaryButtons, className }) => {
  const buttonLayout = [
    <motion.div className="control-bar__secondary-buttons" key="secondary">
      { secondaryButtons
        && Array.from(secondaryButtons).map(animatedButton)}
    </motion.div>,
    <motion.div className="control-bar__primary-buttons" key="primary">
      { buttons
        && Array.from(buttons).map(animatedButton)}
    </motion.div>,
  ];

  return (
    <motion.div
      className={cx(
        'control-bar',
        className,
      )}
      variants={barVariants}
    >
      <AnimatePresence>
        { buttonLayout }
      </AnimatePresence>
    </motion.div>
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
