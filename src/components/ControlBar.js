import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { getCSSVariableAsNumber } from '@codaco/ui/lib/utils/CSSVariables';

const ControlBar = ({ buttons, secondaryButtons, flip, show, className }) => {
  const buttonLayout = [
    <div className="control-bar__primary-buttons" key="primary">
      { buttons &&
        Array.from(buttons).map(button =>
          <motion.div key={button.key} in={show}>{button}</motion.div>)
      }
    </div>,
    <div className="control-bar__secondary-buttons" key="secondary">
      { secondaryButtons &&
        Array.from(secondaryButtons).map(button =>
          <motion.div key={button.key} in={show}>{button}</motion.div>)
      }
    </div>,
  ];

  const transition = {
    type: 'tween',
    ease: 'easeOut',
    duration: getCSSVariableAsNumber('--animation-duration-fast-ms') * 0.001,
  };

  return (
    <motion.div
      key="control-bar"
      className={cx(
        'control-bar',
        className,
      )}
      transition={transition}
      initial="hidden"
      variants={{
        hidden: { translateY: '100%' },
        in: { translateY: '0%' },
      }}
    >
      { flip ? buttonLayout.reverse() : buttonLayout }
    </motion.div>
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
