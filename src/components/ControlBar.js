import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import cx from 'classnames';

const variants = {
  show: { opacity: 1 },
  hide: { opacity: 0 },
};

const animatedButton = (button, index) => (
  <motion.div
    key={(button && button.key) || index}
    variants={variants}
    initial="hide"
    exit="hide"
    animate="show"
  >{button}</motion.div>
);

const ControlBar = ({ buttons, secondaryButtons, flip, show, className }) => {
  const buttonLayout = [
    <div className="control-bar__primary-buttons" key="primary">
      <AnimatePresence>
        { buttons &&
          Array.from(buttons).map(animatedButton)
        }
      </AnimatePresence>
    </div>,
    <div className="control-bar__secondary-buttons" key="secondary">
      <AnimatePresence>
        { secondaryButtons &&
          Array.from(secondaryButtons).map(animatedButton)
        }
      </AnimatePresence>
    </div>,
  ];

  return (
    <div
      className={cx(
        'control-bar',
        {
          'control-bar--show': show,
          'control-bar--flip': flip,
        },
        className,
      )}
    >
      { flip ? buttonLayout.reverse() : buttonLayout }
    </div>
  );
};

ControlBar.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.node),
  secondaryButtons: PropTypes.arrayOf(PropTypes.node),
  className: PropTypes.string,
  show: PropTypes.bool,
  flip: PropTypes.bool,
};

ControlBar.defaultProps = {
  buttons: null,
  secondaryButtons: null,
  className: '',
  show: true,
  flip: false,
};

export { ControlBar };

export default ControlBar;
