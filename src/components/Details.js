import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from '@codaco/ui';

const animations = {
  collapsed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: 'auto',
    opacity: 1,
  },
};

const Details = ({
  children,
  className,
  summary,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(
    () => setIsOpen((s) => !s),
    [setIsOpen],
  );

  return (
    <motion.div
      layout
      className={cx('details', { 'details--is-open': isOpen }, className)}
    >
      <motion.div
        className="details__header"
        onClick={toggleOpen}
      >
        <div className="details__indicator">
          { !isOpen && <Icon name="chevron-right" /> }
          { isOpen && <Icon name="chevron-down" /> }
        </div>
        <div className="details__summary">
          {summary}
        </div>
      </motion.div>
      <motion.div
        layout
        className="details__content"
        variants={animations}
        animate={(isOpen ? 'open' : 'collapsed')}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

Details.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  summary: PropTypes.node,
};

Details.defaultProps = {
  children: null,
  className: null,
  summary: 'Open',
};

export default Details;
