import React from 'react';
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import cx from 'classnames';

const barVariants = {
  visible: {
    y: 0,
    transition: {
      delay: 0.5,
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
    <motion.div layout className="control-bar__secondary-buttons" key="secondary">
      <AnimatePresence initial={false}>
        { secondaryButtons
          && Array.from(secondaryButtons).map(animatedButton)}
      </AnimatePresence>
    </motion.div>,
    <motion.div layout className="control-bar__primary-buttons" key="primary">
      <AnimatePresence initial={false}>
        { buttons
          && Array.from(buttons).map(animatedButton)}
      </AnimatePresence>
    </motion.div>,
  ];

  return (
    <motion.div
      className={cx(
        'control-bar',
        className,
      )}
      variants={barVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimateSharedLayout>
        { buttonLayout }
      </AnimateSharedLayout>
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
