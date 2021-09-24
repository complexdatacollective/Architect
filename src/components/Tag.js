import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion } from 'framer-motion';
import CancelIcon from '@material-ui/icons/CancelRounded';

const Tag = ({
  id,
  children,
  color,
  onClick,
  onReset,
  selected,
}) => {
  const componentClasses = cx(
    'tag',
    {
      'tag--selected': selected,
      'tag--can-reset': !!onReset,
    },
  );

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    onClick(id);
  }, []);

  const handleReset = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    onReset(id);
  }, []);

  return (
    <motion.div
      className={componentClasses}
      onClick={handleClick}
      layout
    >
      <div className="tag__label">
        {children}
      </div>

      { onReset && selected && (
        <div
          className="tag__reset"
          onClick={handleReset}
        >
          <CancelIcon />
        </div>
      )}
    </motion.div>
  );
};

Tag.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  color: PropTypes.string,
  onClick: PropTypes.func,
  onReset: PropTypes.func,
  selected: PropTypes.bool,
};

Tag.defaultProps = {
  children: null,
  color: null,
  onClick: () => {},
  onReset: null,
  selected: false,
};

export default Tag;
