import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import cx from 'classnames';

const Section = ({
  children,
  className,
}) => {
  const classes = cx(
    'home-section',
    className,
  );

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 200 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      layout
    >
      {children}
    </motion.div>
  );
};

Section.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Section.defaultProps = {
  children: null,
  allowOverflow: false,
  className: null,
};

export default Section;
